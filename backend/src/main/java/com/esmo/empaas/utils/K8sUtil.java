package com.esmo.empaas.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.stream.Collectors;

import io.kubernetes.client.PodLogs;
import io.kubernetes.client.openapi.models.*;
import io.kubernetes.client.util.Streams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.kubernetes.client.custom.Quantity;
import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.AppsV1Api;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;

@Component()
public class K8sUtil {

    private final Logger logger = LoggerFactory.getLogger(K8sUtil.class);

    private CoreV1Api k8sCoreApi;
    private AppsV1Api k8sAppsApi;

    private K8sUtil() {
        try {
            ApiClient client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);
        } catch (IOException e) {
            logger.error(e.getMessage(), e);
        }
    }

    public CoreV1Api k8sCoreClient() throws IOException {
        if (k8sCoreApi == null) {
            new K8sUtil();
            k8sCoreApi = new CoreV1Api();
        }

        return k8sCoreApi;
    }

    public AppsV1Api k8sAppsClient() throws IOException {
        if (k8sAppsApi == null) {
            new K8sUtil();
            k8sAppsApi = new AppsV1Api();
        }

        return k8sAppsApi;
    }

    public V1ConfigMap createConfigMap(String name, Map<String, String> data) {
        V1ConfigMap result = null;

        try {
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(name);
            metadata.setLabels(new HashMap<String, String>() {
                {
                    put("app", name);
                }
            });

            V1ConfigMap body = new V1ConfigMap();
            body.setApiVersion("v1");
            body.setKind("ConfigMap");
            body.setData(data);

            result = k8sCoreClient().createNamespacedConfigMap(Constants.K8S_NAMESPACE, body, null, null, null,
                    null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    public V1PersistentVolume createPersistentVolume(String name, String path,
            int size, String accessMode) {
        V1PersistentVolume result = null;

        try {
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(name);
            metadata.setLabels(new HashMap<String, String>() {
                {
                    put("app", name);
                }
            });

            V1HostPathVolumeSource source = new V1HostPathVolumeSource();
            source.setPath(path);

            V1PersistentVolumeSpec spec = new V1PersistentVolumeSpec();
            spec.setStorageClassName("local-storage");
            spec.setAccessModes(Collections.singletonList(accessMode));
            spec.setCapacity(new HashMap<String, Quantity>() {
                {
                    put("storage", new Quantity(String.valueOf(size)));
                }
            });
            spec.setHostPath(source);

            V1PersistentVolume body = new V1PersistentVolume();
            body.setApiVersion("v1");
            body.setKind("PersistentVolume");
            body.setMetadata(metadata);
            body.setSpec(spec);

            result = k8sCoreClient().createPersistentVolume(body, null, null,
                    null, null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    public V1PersistentVolumeClaim createPersistentVolumeClaim(String name, String accessMode,
            int size) {
        V1PersistentVolumeClaim result = null;

        try {
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(name);
            metadata.setLabels(new HashMap<>() {
                {
                    put("app", name);
                }
            });

            V1ResourceRequirements resources = new V1ResourceRequirements();
            resources.setRequests(new HashMap<>() {
                {
                    put("storage", new Quantity(String.valueOf(size)));
                }
            });

            V1PersistentVolumeClaimSpec spec = new V1PersistentVolumeClaimSpec();
            spec.setAccessModes(Collections.singletonList(accessMode));
            spec.setStorageClassName("local-storage");
            spec.setResources(resources);

            V1PersistentVolumeClaim body = new V1PersistentVolumeClaim();
            body.setApiVersion("v1");
            body.setKind("PersistentVolumeClaim");
            body.setMetadata(metadata);
            body.setSpec(spec);

            result = k8sCoreClient().createNamespacedPersistentVolumeClaim(Constants.K8S_NAMESPACE,
                    body,
                    null, null,
                    null, null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    public V1Deployment createDeployment(String name, int replicas, int cpu, int memory, String image, int port,
            List<String> persistentVolumeClaimNames, String configMapRefName) {
        V1Deployment result = null;

        try {
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(name);
            metadata.setLabels(new HashMap<String, String>() {
                {
                    put("app", name);
                }
            });

            V1LabelSelector selector = new V1LabelSelector();
            selector.setMatchLabels(new HashMap<String, String>() {
                {
                    put("app", name);
                }
            });

            V1ResourceRequirements resources = new V1ResourceRequirements();
            resources.setLimits(new HashMap<String, Quantity>() {
                {
                    put("cpu",
                            new Quantity(String.valueOf(cpu)));
                    put("memory", new Quantity(
                            String.valueOf(memory)));
                }
            });
            resources.setRequests(new HashMap<String, Quantity>() {
                {
                    put("cpu",
                            new Quantity(String.valueOf(cpu)));
                    put("memory", new Quantity(
                            String.valueOf(memory)));
                }
            });

            V1ContainerPort ports = new V1ContainerPort();
            ports.setContainerPort(port);

            V1ConfigMapEnvSource envSource = new V1ConfigMapEnvSource();
            envSource.setName(configMapRefName);

            V1EnvFromSource env = new V1EnvFromSource();
            env.setConfigMapRef(envSource);

            List<V1VolumeMount> volumes = Collections.emptyList();
            persistentVolumeClaimNames.forEach(pvc -> {
                V1VolumeMount volume = new V1VolumeMount();
                volume.setName(pvc);
                volume.setMountPath("/data");

                volumes.add(volume);
            });

            V1Container container = new V1Container();
            container.setName(name);
            container.setImage(image);
            container.setImagePullPolicy("Always");
            container.setResources(resources);
            container.setPorts(Collections.singletonList(ports));
            container.setEnvFrom(Collections.singletonList(env));
            container.volumeMounts(volumes);

            List<V1Volume> volumesPod = Collections.emptyList();
            persistentVolumeClaimNames.forEach(pvc -> {
                V1PersistentVolumeClaimVolumeSource claimSource = new V1PersistentVolumeClaimVolumeSource();
                claimSource.claimName(pvc);

                V1Volume volume = new V1Volume();
                volume.setName(pvc);
                volume.setPersistentVolumeClaim(claimSource);

                volumesPod.add(volume);
            });

            V1PodSpec pod = new V1PodSpec();
            pod.setContainers(Collections.singletonList(container));
            pod.setVolumes(volumesPod);

            V1PodTemplateSpec template = new V1PodTemplateSpec();
            template.setMetadata(metadata);
            template.setSpec(pod);

            V1DeploymentSpec spec = new V1DeploymentSpec();
            spec.setReplicas(replicas);
            spec.setSelector(selector);
            spec.setTemplate(template);

            V1Deployment body = new V1Deployment();
            body.setApiVersion("v1");
            body.setKind("Deployment");
            body.setMetadata(metadata);
            body.setSpec(spec);

            result = k8sAppsClient().createNamespacedDeployment(Constants.K8S_NAMESPACE,
                    body, null, null, null,
                    null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
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
        } catch (ApiException | IOException e) {
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
                        pod.getMetadata() != null ? pod.getMetadata().getName() : name,
                        Constants.K8S_NAMESPACE,
                        null,
                        Boolean.FALSE,
                        null,
                        Integer.MAX_VALUE,
                        null,
                        Boolean.FALSE,
                        Integer.MAX_VALUE,
                        40,
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
            return k8sAppsClient().readNamespacedDeployment(deploymentId, Constants.K8S_NAMESPACE, null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
        }

        return null;
    }
}
