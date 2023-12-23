export type Service = {
    apiVersion: "v1";
    kind: "Service";
    metadata: {
        creationTimestamp: "2023-12-22T23:11:40.000Z";
        name: "withoput-resources-service";
        namespace: "vkps";
        resourceVersion: "15580";
        uid: "d74009df-25ff-4749-89b3-2ad2e4ed2dda";
    };
    spec: {
        clusterIP: "10.101.225.104";
        clusterIPs: ["10.101.225.104"];
        externalTrafficPolicy: "Cluster";
        internalTrafficPolicy: "Cluster";
        ipFamilies: ["IPv4"];
        ipFamilyPolicy: "SingleStack";
        ports: [
            {
                name: "http";
                nodePort: 30391;
                port: 80;
                protocol: "TCP";
                targetPort: 80;
            }
        ];
        selector: {
            app: "withoput-resources";
        };
        sessionAffinity: "None";
        type: "NodePort";
    };
    status: {
        loadBalancer: {
            ingress: [
                {
                    hostname: "localhost";
                }
            ];
        };
    };
};
