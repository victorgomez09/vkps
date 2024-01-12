package com.esmo.empaas.utils;

import java.io.IOException;

import org.springframework.stereotype.Component;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.Configuration;
import io.kubernetes.client.openapi.apis.CoreV1Api;
import io.kubernetes.client.util.Config;

@Component()
public class K8sUtil {

    private ApiClient client;
    private CoreV1Api k8sCoreApi;

    private K8sUtil() {
        try {
            client = Config.defaultClient();
            Configuration.setDefaultApiClient(client);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public CoreV1Api k8sClient() throws IOException {
        if (k8sCoreApi == null) {
            new K8sUtil();
            k8sCoreApi = new CoreV1Api();
        }

        return k8sCoreApi;
    }

}
