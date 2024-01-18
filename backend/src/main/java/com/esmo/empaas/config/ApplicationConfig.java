package com.esmo.empaas.config;

import java.io.IOException;
import java.util.HashMap;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.esmo.empaas.utils.Constants;
import com.esmo.empaas.utils.K8sUtil;

import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1NamespaceSpec;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import jakarta.annotation.PostConstruct;

@Configuration
public class ApplicationConfig {

    private final Logger logger = LoggerFactory.getLogger(ApplicationConfig.class);

    private final K8sUtil k8sUtil;

    @Autowired
    public ApplicationConfig(K8sUtil k8sUtil) {
        this.k8sUtil = k8sUtil;
    }

    @PostConstruct()
    public void init() {
        try {
            V1ObjectMeta metadata = new V1ObjectMeta();
            metadata.setName(Constants.K8S_NAMESPACE);
            metadata.setLabels(new HashMap<>() {
                {
                    put("name", Constants.K8S_NAMESPACE);
                }
            });
            V1Namespace body = new V1Namespace();
            body.setMetadata(metadata);

            k8sUtil.k8sCoreClient().createNamespace(body, null, null, null, null);
            // k8sUtil.k8sCoreClient().createNamespace(new V1Namespace() {
            // {
            // setApiVersion("v1");
            // setKind("Namespace");
            // metadata(new V1ObjectMeta() {
            // {
            // setName(Constants.K8S_NAMESPACE);
            // setLabels(new HashMap<>() {
            // {
            // put("name", Constants.K8S_NAMESPACE);
            // }
            // });
            // }
            // });
            // }
            // }, null, null, null, null);
        } catch (ApiException e) {
            logger.error("API EXCEPTION: " + e.getResponseBody());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Bean
    ModelMapper modelMapper() {
        return new ModelMapper();
    }
}
