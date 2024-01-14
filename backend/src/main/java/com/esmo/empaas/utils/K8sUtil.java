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
            System.out.println("error");
//            logger.error(e.getMessage(), e);
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
            result = k8sCoreClient().createNamespacedConfigMap(Constants.K8S_NAMESPACE, new V1ConfigMap() {
                {
                    setApiVersion("v1");
                    setKind("ConfigMap");
                    setMetadata(new V1ObjectMeta() {
                        {
                            setName(name);
                            setLabels(new HashMap<String, String>() {
                                {
                                    put("app", name);
                                }
                            });
                        }
                    });
                    setData(data);
                }
            }, null, null, null,
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
            result = k8sCoreClient().createPersistentVolume(new V1PersistentVolume() {
                {
                    setApiVersion("v1");
                    setKind("PersistentVolume");
                    setMetadata(new V1ObjectMeta() {
                        {
                            setName(name);
                            setLabels(new HashMap<String, String>() {
                                {
                                    put("app", name);
                                }
                            });
                        }
                    });
                    setSpec(new V1PersistentVolumeSpec() {
                        {
                            setStorageClassName("local-storage");
                            setAccessModes(Collections.singletonList(accessMode));
                            setCapacity(new HashMap<String, Quantity>() {
                                {
                                    put("storage", new Quantity(String.valueOf(size)));
                                }
                            });
                            setHostPath(new V1HostPathVolumeSource() {
                                {
                                    setPath(path);
                                }
                            });
                        }
                    });
                }
            }, null, null,
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
            result = k8sCoreClient().createNamespacedPersistentVolumeClaim(Constants.K8S_NAMESPACE,
                    new V1PersistentVolumeClaim() {
                        {
                            setApiVersion("v1");
                            setKind("PersistentVolumeClaim");
                            setMetadata(new V1ObjectMeta() {
                                {
                                    setName(name);
                                    setLabels(new HashMap<>() {
                                        {
                                            put("app", name);
                                        }
                                    });
                                }
                            });
                            setSpec(new V1PersistentVolumeClaimSpec() {
                                {
                                    setAccessModes(Collections.singletonList(accessMode));
                                    setStorageClassName("local-storage");
                                    setResources(new V1ResourceRequirements() {
                                        {
                                            setRequests(new HashMap<>() {
                                                {
                                                    put("storage", new Quantity(String.valueOf(size)));
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    },
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
            result = k8sAppsClient().createNamespacedDeployment(Constants.K8S_NAMESPACE,
                    new V1Deployment() {
                        {
                            setApiVersion("apps/v1");
                            setKind("Deployment");
                            setMetadata(new V1ObjectMeta() {
                                {
                                    setName(name);
                                    setLabels(new HashMap<String, String>() {
                                        {
                                            put("app", name);
                                        }
                                    });
                                }
                            });
                            setSpec(new V1DeploymentSpec() {
                                {
                                    setReplicas(replicas);
                                    setSelector(new V1LabelSelector() {
                                        {
                                            setMatchLabels(new HashMap<String, String>() {
                                                {
                                                    put("app", name);
                                                }
                                            });
                                        }
                                    });
                                    setTemplate(new V1PodTemplateSpec() {
                                        {
                                            metadata(new V1ObjectMeta() {
                                                {
                                                    setLabels(new HashMap<String, String>() {
                                                        {
                                                            put("app", name);
                                                        }
                                                    });
                                                }
                                            });
                                            spec(new V1PodSpec() {
                                                {
                                                    setContainers(List.of(new V1Container() {
                                                        {
                                                            name(name);
                                                            image(image);
                                                            imagePullPolicy("Always");
                                                            resources(new V1ResourceRequirements() {
                                                                {
                                                                    limits(new HashMap<String, Quantity>() {
                                                                        {
                                                                            put("cpu",
                                                                                    new Quantity(String.valueOf(cpu)));
                                                                            put("memory", new Quantity(
                                                                                    String.valueOf(memory)));
                                                                        }
                                                                    });
                                                                    requests(new HashMap<String, Quantity>() {
                                                                        {
                                                                            put("cpu",
                                                                                    new Quantity(String.valueOf(cpu)));
                                                                            put("memory", new Quantity(
                                                                                    String.valueOf(memory)));
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                            ports(List.of(new V1ContainerPort() {
                                                                {
                                                                    containerPort(port);
                                                                }
                                                            }));
                                                            // volumeMounts(Arrays.asList(new V1VolumeMount() {
                                                            // {
                                                            // name(persistentVolumeClaimName);
                                                            // mountPath("/data");
                                                            // }
                                                            // }));

                                                            envFrom(List.of(new V1EnvFromSource() {
                                                                {
                                                                    configMapRef(new V1ConfigMapEnvSource() {
                                                                        {
                                                                            name(configMapRefName);
                                                                        }
                                                                    });
                                                                }
                                                            }));

                                                            volumeMounts(
                                                                    persistentVolumeClaimNames.stream().map(pvc -> {
                                                                        return new V1VolumeMount() {
                                                                            {
                                                                                name(pvc);
                                                                                mountPath("/data");
                                                                            }
                                                                        };
                                                                    }).collect(Collectors.toList()));
                                                        }
                                                    }));
                                                    // voluumes(Arrays.asList(new V1Volume() {
                                                    // {
                                                    // name(persistentVolumeClaimNames);
                                                    // persistentVolumeClaim(
                                                    // new V1PersistentVolumeClaimVolumeSource() {
                                                    // {
                                                    // claimName(persistentVolumeClaimNames);
                                                    // }
                                                    // });
                                                    // }
                                                    // }));
                                                    volumes(persistentVolumeClaimNames.stream().map(pvc -> {
                                                        return new V1Volume() {
                                                            {
                                                                name(pvc);
                                                                persistentVolumeClaim(
                                                                        new V1PersistentVolumeClaimVolumeSource() {
                                                                            {
                                                                                claimName(pvc);
                                                                            }
                                                                        });
                                                            }
                                                        };
                                                    }).collect(Collectors.toList()));
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    }, null, null, null,
                    null);
        } catch (ApiException | IOException e) {
            logger.error(e.getMessage(), e);
        }

        return result;
    }

    public List<V1Pod> getPods(String deploymentId) {
        try {
            V1Deployment deployment = k8sAppsClient().readNamespacedDeployment(deploymentId, Constants.K8S_NAMESPACE, null);

            return k8sCoreClient().listPodForAllNamespaces(null, null, null, "app=" + Objects.requireNonNull(deployment.getMetadata()).getName(), null, null, null, null, null, null, null).getItems();
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
                String readNamespacedPodLog =
                        k8sCoreClient().readNamespacedPodLog(
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
