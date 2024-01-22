package com.esmo.empaas.config;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

import com.esmo.empaas.utils.Constants;
import com.esmo.empaas.utils.K8sUtil;

import io.kubernetes.client.openapi.ApiClient;
import io.kubernetes.client.openapi.ApiException;
import io.kubernetes.client.openapi.models.V1Namespace;
import io.kubernetes.client.openapi.models.V1ObjectMeta;
import io.kubernetes.client.util.Config;
import jakarta.annotation.PostConstruct;

@Configuration
public class ApplicationConfig {

	private final Logger logger = LoggerFactory.getLogger(ApplicationConfig.class);

	private final K8sUtil k8sUtil;

	public ApplicationConfig(K8sUtil k8sUtil) {
		this.k8sUtil = k8sUtil;
	}

	@PostConstruct()
	public void init() {
		try {
			ApiClient client = Config.defaultClient();
			io.kubernetes.client.openapi.Configuration.setDefaultApiClient(client);

			Map<String, String> labels = new HashMap<>();
			labels.put("name", Constants.K8S_NAMESPACE);
			V1ObjectMeta metadata = new V1ObjectMeta();
			metadata.setName(Constants.K8S_NAMESPACE);
			metadata.setLabels(labels);

			V1Namespace body = new V1Namespace();
			body.setMetadata(metadata);

			if (k8sUtil.k8sCoreClient().readNamespace(Constants.K8S_NAMESPACE, null) == null) {
				k8sUtil.k8sCoreClient().createNamespace(body, null, null, null, null);
			}
		} catch (ApiException e) {
			logger.error("API EXCEPTION: {}, {}", e.getCode(), e.getResponseBody());
		} catch (IOException e) {
			logger.error(e.getMessage(), e);
		}
	}

	@Bean
	ModelMapper modelMapper() {
		return new ModelMapper();
	}
}
