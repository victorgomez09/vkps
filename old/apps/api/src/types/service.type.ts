export type Service = {
    apiVersion: string;
    kind: string;
    metadata: {
        creationTimestamp: Date;
        name: string;
        namespace: string;
        resourceVersion: string;
        uid: string;
    };
    spec: {
        clusterIP: string;
        clusterIPs: string[];
        externalTrafficPolicy: string;
        internalTrafficPolicy: string;
        ipFamilies: string[];
        ipFamilyPolicy: string;
        ports: {
            name: string;
            nodePort: number;
            port: number;
            protocol: string;
            targetPort: number | string;
        }[];
        selector: {
            app: string;
        };
        sessionAffinity: string;
        type: string;
    };
    status: {
        loadBalancer: {
            ingress: {
                hostname: string;
            }[];
        };
    };
};
