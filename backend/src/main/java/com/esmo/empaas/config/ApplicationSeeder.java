package com.esmo.empaas.config;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;

import com.esmo.empaas.entities.AddonEntity;
import com.esmo.empaas.repositories.AddonEnvRepository;
import com.esmo.empaas.repositories.AddonRepository;
import com.esmo.empaas.repositories.AddonVersionRepository;
import com.esmo.empaas.repositories.AddonVolumeRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@Configuration
public class ApplicationSeeder {

	@Value("classpath:json/*")
	private Resource[] resources;

	@Bean
	CommandLineRunner runner(AddonRepository addonRepository, AddonVersionRepository addonVersionRepository,
			AddonEnvRepository addonEnvRepository, AddonVolumeRepository addonVolumeRepository) {
		return args -> {
			ObjectMapper mapper = new ObjectMapper();

			for (Resource resource : resources) {
				TypeReference<AddonEntity> typeReference = new TypeReference<AddonEntity>() {
				};
				InputStream inputStream = TypeReference.class.getResourceAsStream("/json/" + resource.getFilename());
				try {
					AddonEntity addon = mapper.readValue(inputStream, typeReference);
					if (addonRepository.findByName(addon.getName()).isEmpty()) {
						addonRepository.save(addon);
						addon.getVersions().forEach(version -> {
							version.setAddon(addon);
							addonVersionRepository.save(version);
						});
						addon.getEnvs().forEach(env -> {
							env.setAddon(addon);
							env.setOptional(env.getValue().isEmpty());
							addonEnvRepository.save(env);
						});
						addon.getVolumes().forEach(volume -> {
							volume.setAddon(addon);
							addonVolumeRepository.save(volume);
						});
					}
				} catch (IOException e) {
					System.out.println("Unable to save addon: " + e.getMessage());
				}
			}
		};
	}
}
