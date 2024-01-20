package com.esmo.empaas.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.kubernetes.client.PodLogs;
import io.kubernetes.client.custom.Quantity;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.openapi.models.V1ConfigMap;
import io.kubernetes.client.openapi.models.V1ConfigMapEnvSource;
import io.kubernetes.client.openapi.models.V1Container;
import io.kubernetes.client.openapi.models.V1ContainerPort;
import io.kubernetes.client.openapi.models.V1Deployment;
import io.kubernetes.client.openapi.models.V1DeploymentBuilder;
import io.kubernetes.client.openapi.models.V1DeploymentSpec;
import io.kubernetes.client.openapi.models.V1EnvFromSource;
import io.kubernetes.client.openapi.models.V1HostPathVolumeSource;
import io.kubernetes.client.openapi.models.V1LabelSelector;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.openapi.models.V1PersistentVolume;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaim;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimSpec;
import io.kubernetes.client.openapi.models.V1PersistentVolumeClaimVolumeSource;
import io.kubernetes.client.openapi.models.V1PersistentVolumeSpec;
import io.kubernetes.client.openapi.models.V1Pod;
import io.kubernetes.client.openapi.models.V1PodSpec;
import io.kubernetes.client.openapi.models.V1PodTemplateSpec;
import io.kubernetes.client.openapi.models.V1ResourceRequirements;
import io.kubernetes.client.openapi.models.V1Volume;
import io.kubernetes.client.openapi.models.V1VolumeMount;
import io.kubernetes.client.util.Streams;

@Component()
public class K8sUtil {

	private final Logger logger = LoggerFactory.getLogger(K8sUtil.class);

	private final StringUtil stringUtil;
	private CoreV1Api k8sCoreApi;
	private AppsV1Api k8sAppsApi;

	public K8sUtil(StringUtil stringUtil) {
		this.stringUtil = stringUtil;
	}

	public CoreV1Api k8sCoreClient() {
		if (k8sCoreApi == null) {
			k8sCoreApi = new CoreV1Api();
		}

		return k8sCoreApi;
	}

	public AppsV1Api k8sAppsClient() {
		if (k8sAppsApi == null) {
			k8sAppsApi = new AppsV1Api();
		}

		return k8sAppsApi;
	}

	public V1ConfigMap createConfigMap(String name, Map<String, String> data) {
		V1ConfigMap result = null;

		try {
			Map<String, String> labels = new HashMap<>();
			labels.put("app", name);
			V1ObjectMeta metadata = new V1ObjectMeta();
			metadata.setName(name);
			metadata.setLabels(labels);

			V1ConfigMap body = new V1ConfigMap();
			body.setApiVersion("v1");
			body.setKind("ConfigMap");
			body.setData(data);

			result = k8sCoreClient().createNamespacedConfigMap(Constants.K8S_NAMESPACE, body, null, null, null, null);
		} catch (ApiException e) {
			logger.error(e.getMessage(), e);
		}

		return result;
	}

	public V1PersistentVolume createPersistentVolume(String name, String path, int size, String accessMode) {
		V1PersistentVolume result = null;

		try {
			Map<String, String> labels = new HashMap<>();
			labels.put("app", name);
			V1ObjectMeta metadata = new V1ObjectMeta();
			metadata.setName(name);
			metadata.setLabels(labels);

			V1HostPathVolumeSource source = new V1HostPathVolumeSource();
			source.setPath(path);

			Map<String, Quantity> capacity = new HashMap<>();
			capacity.put("storage", new Quantity(String.valueOf(size)));
			V1PersistentVolumeSpec spec = new V1PersistentVolumeSpec();
			spec.setStorageClassName("local-storage");
			spec.setAccessModes(Collections.singletonList(accessMode));
			spec.setCapacity(capacity);
			spec.setHostPath(source);

			V1PersistentVolume body = new V1PersistentVolume();
			body.setApiVersion("v1");
			body.setKind("PersistentVolume");
			body.setMetadata(metadata);
			body.setSpec(spec);

			result = k8sCoreClient().createPersistentVolume(body, null, null, null, null);
		} catch (ApiException e) {
			logger.error(e.getMessage(), e);
		}

		return result;
	}

	public V1PersistentVolumeClaim createPersistentVolumeClaim(String name, String accessMode, int size) {
		V1PersistentVolumeClaim result = null;

		try {
			Map<String, String> labels = new HashMap<>();
			labels.put("app", name);
			V1ObjectMeta metadata = new V1ObjectMeta();
			metadata.setName(name);
			metadata.setLabels(labels);

			Map<String, Quantity> capacity = new HashMap<>();
			capacity.put("storage", new Quantity(String.valueOf(size)));
			V1ResourceRequirements resources = new V1ResourceRequirements();
			resources.setRequests(capacity);

			V1PersistentVolumeClaimSpec spec = new V1PersistentVolumeClaimSpec();
			spec.setAccessModes(Collections.singletonList(accessMode));
			spec.setStorageClassName("local-storage");
			spec.setResources(resources);

			V1PersistentVolumeClaim body = new V1PersistentVolumeClaim();
			body.setApiVersion("v1");
			body.setKind("PersistentVolumeClaim");
			body.setMetadata(metadata);
			body.setSpec(spec);

			result = k8sCoreClient().createNamespacedPersistentVolumeClaim(Constants.K8S_NAMESPACE, body, null, null,
					null, null);
		} catch (ApiException e) {
			logger.error(e.getMessage(), e);
		}

		return result;
	}

	public V1Deployment createDeployment(String name, int replicas, int cpu, int memory, String image, int port,
			List<String> persistentVolumeClaimNames, String configMapRefName) {
		V1Deployment result = null;

		try {
			Map<String, Quantity> capacity = new HashMap<>();
			capacity.put("cpu", new Quantity(String.valueOf(cpu) + "m"));
			capacity.put("memory", new Quantity(String.valueOf(memory) + "M"));
			Map<String, Quantity> requests = new HashMap<>();
			requests.put("cpu", new Quantity(String.valueOf(cpu) + "m"));
			requests.put("memory", new Quantity(String.valueOf(memory) + "M"));

			List<V1VolumeMount> volumes = Collections.emptyList();
			persistentVolumeClaimNames.forEach(pvc -> {
				V1VolumeMount volume = new V1VolumeMount();
				volume.setName(pvc);
				volume.setMountPath("/data");

				volumes.add(volume);
			});

			List<V1Volume> volumesPod = Collections.emptyList();
			persistentVolumeClaimNames.forEach(pvc -> {
				V1PersistentVolumeClaimVolumeSource claimSource = new V1PersistentVolumeClaimVolumeSource();
				claimSource.claimName(pvc);

				V1Volume volume = new V1Volume();
				volume.setName(pvc);
				volume.setPersistentVolumeClaim(claimSource);

				volumesPod.add(volume);
			});

			V1Container container = new V1Container().name(stringUtil.parseName(name)).image(image)
					.imagePullPolicy("Always")
					.resources(new V1ResourceRequirements().requests(requests).limits(capacity))
					.ports(Collections.singletonList(new V1ContainerPort().containerPort(port)))

					.volumeMounts(volumes);
			if (configMapRefName != null) {
				container.envFrom(Collections.singletonList(
						new V1EnvFromSource().configMapRef(new V1ConfigMapEnvSource().name(configMapRefName))));
			}

			V1DeploymentBuilder deploymentBuilder = new V1DeploymentBuilder().withApiVersion("apps/v1")
					.withKind("Deployment")
					.withMetadata(
							new V1ObjectMeta().name(stringUtil.parseName(name)).namespace(Constants.K8S_NAMESPACE))
					.withSpec(new V1DeploymentSpec().replicas(replicas)
							.selector(new V1LabelSelector().putMatchLabelsItem("name", stringUtil.parseName(name)))
							.template(new V1PodTemplateSpec()
									.metadata(new V1ObjectMeta().putLabelsItem("name", stringUtil.parseName(name)))
									.spec(new V1PodSpec().containers(Collections.singletonList(container))
											.volumes(volumesPod))));
			result = k8sAppsClient().createNamespacedDeployment(Constants.K8S_NAMESPACE, deploymentBuilder.build(),
					null, null, null, null);
		} catch (ApiException e) {
			logger.error(String.valueOf(e.getCode()), e.getMessage(), e.getResponseBody());
		}

		return result;
	}

	public List<V1Pod> getPods(String deploymentId) {
		try {
			V1Deployment deployment = k8sAppsClient().readNamespacedDeployment(deploymentId, Constants.K8S_NAMESPACE,
					null);

			return k8sCoreClient().listPodForAllNamespaces(null, null, null,
					"app=" + Objects.requireNonNull(deployment.getMetadata()).getName(), null, null, null, null, null,
					null, null).getItems();
		} catch (ApiException e) {
			logger.error(e.getMessage(), e);
		}

		return Collections.emptyList();
	}

	public void getLogs(List<String> podNames) {
		podNames.forEach(name -> {
			try {
				V1Pod pod = k8sCoreClient().readNamespacedPod(name, Constants.K8S_NAMESPACE, null);

				// Log method 1
				String readNamespacedPodLog = k8sCoreClient().readNamespacedPodLog(
						pod.getMetadata() != null ? pod.getMetadata().getName() : name, Constants.K8S_NAMESPACE, null,
						Boolean.FALSE, null, Integer.MAX_VALUE, null, Boolean.FALSE, Integer.MAX_VALUE, 40,
						Boolean.FALSE);
				System.out.println(readNamespacedPodLog);

				// Log method 2
				PodLogs logs = new PodLogs();
				InputStream is = logs.streamNamespacedPodLog(pod);
				Streams.copy(is, System.out);
			} catch (ApiException | IOException e) {
				logger.error(e.getMessage(), e);
			}
		});
	}

	public V1Deployment getDeployment(String deploymentId) {
		try {
			return k8sAppsClient().readNamespacedDeployment(stringUtil.parseName(deploymentId), Constants.K8S_NAMESPACE,
					null);
		} catch (ApiException e) {
			if (e.getCode() != 404) {
				logger.error(String.valueOf(e.getCode()), e.getMessage(), e.getResponseBody());
			}
		}

		return null;
	}
}
