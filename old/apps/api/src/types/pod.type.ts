export type Pod = {
    metadata: {
        creationTimestamp: Date;
        generateName: string;
        labels: {
            app: string;
            "pod-template-hash": string;
        };
        name: string;
        namespace: string;
        ownerReferences: [
            {
                apiVersion: string;
                blockOwnerDeletion: boolean;
                controller: boolean;
                kind: string;
                name: string;
                uid: string;
            }
        ];
        resourceVersion: string;
        uid: string;
    };
    spec: {
        containers: [
            {
                image: string;
                imagePullPolicy: string;
                name: string;
                ports: [
                    {
                        containerPort: number;
                        hostPort: number;
                        name: string;
                        protocol: string;
                    }
                ];
                resources: object;
                terminationMessagePath: string;
                terminationMessagePolicy: string;
                volumeMounts: [
                    {
                        mountPath: string;
                        name: string;
                        readOnly: boolean;
                    }
                ];
            }
        ];
        dnsPolicy: string;
        enableServiceLinks: boolean;
        nodeName: string;
        preemptionPolicy: string;
        priority: number;
        restartPolicy: string;
        schedulerName: string;
        securityContext: object;
        serviceAccount: string;
        serviceAccountName: string;
        terminationGracePeriodSeconds: boolean;
        tolerations: {
            effect: string;
            key: string;
            operator: string;
            tolerationSeconds: number;
        }[];
        volumes: {
            name: string;
            projected: {
                defaultMode: number;
                sources: [
                    {
                        serviceAccountToken: {
                            expirationSeconds: number;
                            path: string;
                        };
                    },
                    {
                        configMap: {
                            items: [
                                {
                                    key: string;
                                    path: string;
                                }
                            ];
                            name: string;
                        };
                    },
                    {
                        downwardAPI: {
                            items: [
                                {
                                    fieldRef: {
                                        apiVersion: string;
                                        fieldPath: string;
                                    };
                                    path: string;
                                }
                            ];
                        };
                    }
                ];
            };
        }[];
    };
    status: {
        conditions: {
            lastProbeTime: Date;
            lastTransitionTime: Date;
            status: string;
            type: string;
        }[];
        containerStatuses: {
            containerID: string;
            image: string;
            imageID: string;
            lastState: {
                terminated: {
                    containerID: string;
                    exitCode: number;
                    finishedAt: string;
                    reason: string;
                    startedAt: Date;
                };
            };
            name: string;
            ready: boolean;
            restartCount: number;
            started: boolean;
            state: {
                running: {
                    startedAt: Date;
                };
            };
        }[];
        hostIP: number;
        phase: string;
        podIP: string;
        podIPs: {
            ip: string;
        }[];
        qosClass: string;
        startTime: Date;
    };
};
