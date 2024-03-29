package com.esmo.empaas.services;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.esmo.empaas.entities.ApplicationEntity;
import com.esmo.empaas.entities.ApplicationEnvEntity;
import com.esmo.empaas.exceptions.ResourceAlreadyExistsException;
import com.esmo.empaas.exceptions.ResourceNotFoundException;
import com.esmo.empaas.repositories.ApplicationRepository;
import com.esmo.empaas.utils.CmdUtil;
import com.esmo.empaas.utils.Constants;
import com.esmo.empaas.utils.K8sUtil;

import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaim;
import io.kubernetes.client.openapi.models.V1Pod;

@Service
public class ApplicationService {

	private final K8sUtil k8sUtil;
	private final CmdUtil cmdUtil;
	private final BuildpackService buildpackService;
	private final ApplicationRepository repository;

	public ApplicationService(K8sUtil k8sUtil, CmdUtil cmdUtil, BuildpackService buildpackService,
			ApplicationRepository repository) {
		this.k8sUtil = k8sUtil;
		this.cmdUtil = cmdUtil;
		this.buildpackService = buildpackService;
		this.repository = repository;
	}

	public List<ApplicationEntity> findAll() {
		return repository.findAll();
	}

	public ApplicationEntity findById(String id) {
		return repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));
	}

	public Map<String, String> findLogs(String applicationId) {
		ApplicationEntity application = repository.findById(applicationId)
				.orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));

		List<String> pods = k8sUtil.getPods(application.getName()).stream().map(V1Pod::getMetadata)
				.filter(Objects::nonNull).map(V1ObjectMeta::getName).toList();

		return k8sUtil.getLogs(pods);
	}

	public ApplicationEntity create(ApplicationEntity data) {
		if (repository.findByName(data.getName()).isPresent()) {
			throw new ResourceAlreadyExistsException("Application", "name", data.getName());
		}

		data.getEnvs().forEach(e -> e.setApplication(data));
		data.getVolumes().forEach(v -> v.setApplication(data));
		ApplicationEntity application = repository.save(data);

		if (application.getRepositoryUrl() != null && !application.getRepositoryUrl().isEmpty()) {
			cmdUtil.executeCommand("git clone " + application.getRepositoryUrl() + " " + Constants.REPOSITORIES_PATH);
		}

		return application;
	}

	public V1Deployment deploy(String id) {
		ApplicationEntity application = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

		if (k8sUtil.getDeployment(application.getName()) != null) {
			throw new ResourceAlreadyExistsException("Deployment", "id", application.getId());
		}

		if (application.getRepositoryUrl() != null && !application.getRepositoryUrl().isEmpty()) {
			buildpackService.build(application.getBuildpack().getName() + ":" + application.getBuildpackVersion(), null,
					application.getPort(), application.getInstallCommand(), application.getBuildCommand(),
					application.getStartCommand(), application.getBaseDirectory(), application.getEnvs().stream()
							.collect(Collectors.toMap(ApplicationEnvEntity::getKey, ApplicationEnvEntity::getValue)));

			cmdUtil.executeCommand("docker build -t localhost:5000/" + application.getName() + " "
					+ Constants.REPOSITORIES_PATH + "/" + application.getName());
			cmdUtil.executeCommand("docker push localhost:5000/" + application.getName());
		}

		String configMap = null;
		if (!application.getEnvs().isEmpty()) {
			configMap = Objects
					.requireNonNull(k8sUtil
							.createConfigMap(application.getName(),
									application.getEnvs().stream().collect(Collectors
											.toMap(ApplicationEnvEntity::getKey, ApplicationEnvEntity::getValue)))
							.getMetadata())
					.getName();
		}

		List<String> pvcNamesList = new ArrayList<>(Collections.emptyList());
		if (!application.getVolumes().isEmpty()) {
			application.getVolumes().forEach(v -> {
				k8sUtil.createPersistentVolume(application.getName(), v.getPath(), v.getSize(), v.getAccessMode());

				V1PersistentVolumeClaim pvc = k8sUtil.createPersistentVolumeClaim(application.getName(),
						v.getAccessMode(), v.getSize());

				pvcNamesList.add(Objects.requireNonNull(pvc.getMetadata()).getName());
			});
		}

		return k8sUtil.createDeployment(application.getName(), application.getReplicas(),
				application.getMemory(), application.getCpu(), application.getDockerImage(), application.getPort(),
				pvcNamesList, configMap);
	}

	public ApplicationEntity update(String id, ApplicationEntity data) {
		ApplicationEntity entity = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

		entity.setBot(data.isBot());
		entity.setCpu(data.getCpu());
		entity.setDescription(data.getDescription());
		entity.setDockerImage(data.getDockerImage());
		entity.setMemory(data.getMemory());
		entity.setName(data.getName());
		entity.setPort(data.getPort());
		entity.setReplicas(data.getReplicas());
		entity.setRepositoryUrl(data.getRepositoryUrl());

		entity.setEnvs(data.getEnvs());
		entity.setVolumes(data.getVolumes());

		return repository.save(entity);
	}

	public void delete(String id) {
		ApplicationEntity entity = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Application", "id", id));

		repository.delete(entity);
	}
}
