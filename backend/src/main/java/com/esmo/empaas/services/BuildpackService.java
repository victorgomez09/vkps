package com.esmo.empaas.services;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.esmo.empaas.entities.BuildpackEntity;
import com.esmo.empaas.exceptions.ResourceAlreadyExistsException;
import com.esmo.empaas.exceptions.ResourceNotFoundException;
import com.esmo.empaas.repositories.BuildpackRepository;
import com.esmo.empaas.utils.DockerUtil;
import com.esmo.empaas.utils.FileUtil;

@Service
public class BuildpackService {

	private final FileUtil fileUtil;
	private final DockerUtil dockerUtil;
	private final BuildpackRepository buildpackRepository;

	public BuildpackService(FileUtil fileUtil, DockerUtil dockerUtil, BuildpackRepository buildpackRepository) {
		this.fileUtil = fileUtil;
		this.dockerUtil = dockerUtil;
		this.buildpackRepository = buildpackRepository;
	}

	public BuildpackEntity findById(String id) {
		return buildpackRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Buildpack", "id", id));
	}

	public List<BuildpackEntity> findAll() {
		return buildpackRepository.findAll();
	}

	public BuildpackEntity select(String projectDir) {
		BuildpackEntity buildpack = null;

		if (fileUtil.searchFile(projectDir, "package.json")) {
			buildpack = buildpackRepository.findByName("nodejs")
					.orElseThrow(() -> new ResourceNotFoundException("Buildpack", "name", "nodejs"));
		}

		return buildpack;
	}

	public BuildpackEntity findByName(String name) {
		return buildpackRepository.findByName(name)
				.orElseThrow(() -> new ResourceNotFoundException("Buildpack", "name", name));
	}

	public BuildpackEntity save(BuildpackEntity data) {
		if (buildpackRepository.findByName(data.getName()).isPresent()) {
			throw new ResourceAlreadyExistsException("Buildpack", "name", data.getName());
		}

		return buildpackRepository.save(data);
	}

	public void build(String baseImage, String workdir, int port, String installCommand, String buildCommand,
			String startCommand, String baseDirectory, Map<String, String> envs) {
		switch (baseImage.split(":")[0]) {
		case "nodejs":
			dockerUtil.createNodeJsDockerFile(baseImage, workdir, port, installCommand, buildCommand, startCommand,
					baseDirectory, envs);

			break;
		default:
			break;
		}
	}
}
