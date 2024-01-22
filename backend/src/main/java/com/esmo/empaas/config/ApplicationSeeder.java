package com.esmo.empaas.config;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.esmo.empaas.entities.AddonEntity;
import com.esmo.empaas.entities.AddonEnvEntity;
import com.esmo.empaas.entities.AddonVersionEntity;
import com.esmo.empaas.entities.AddonVolumeEntity;
import com.esmo.empaas.repositories.AddonEnvRepository;
import com.esmo.empaas.repositories.AddonRepository;
import com.esmo.empaas.repositories.AddonVersionRepository;
import com.esmo.empaas.repositories.AddonVolumeRepository;

@Configuration
public class ApplicationSeeder {

    @Bean
    String seedAddons(AddonRepository addonRepository, AddonVersionRepository addonVersionRepository,
            AddonEnvRepository addonEnvRepository, AddonVolumeRepository addonVolumeRepository) {
        if (!addonRepository.findByName("lscr.io/linuxserver/code-server:latest").isPresent()) {
            AddonEntity addon = addonRepository
                    .save(AddonEntity.builder().name("code-server").fancyName("VS Code Server")
                            .description("Run VS Code on any machine anywhere and access it in the browser.")
                            .image("lscr.io/linuxserver/code-server")
                            .logo("")
                            .port(8080)
                            .build());

            Map<String, String> envs = new HashMap<>();
            envs.put("PUID", "1000");
            envs.put("PGID", "1000");
            envs.put("TZ", "Etc/UTC");
            envs.put("PASSWORD", "");
            envs.put("HASHED_PASSWORD", "");
            envs.put("SUDO_PASSWORD", "");
            envs.put("SUDO_PASSWORD_HASH", "");
            envs.put("PROXY_DOMAIN", "");
            envs.put("DEFAULT_WORKSPACE", "");
            List<AddonEnvEntity> envEntities = new ArrayList<>();
            envs.forEach((key, value) -> {
                envEntities.add(addonEnvRepository
                        .save(AddonEnvEntity.builder().key(key).value(value).optional(value.isEmpty())
                                .addon(addon)
                                .build()));
            });

            List<AddonVolumeEntity> volumeEntities = new ArrayList<>();
            volumeEntities
                    .add(addonVolumeRepository.save(AddonVolumeEntity.builder().path("/config")
                            .accessMode("ReadWriteOnce").size(2048)
                            .addon(addon).build()));

            List<AddonVersionEntity> versionEntities = new ArrayList<>();
            versionEntities.add(addonVersionRepository.save(AddonVersionEntity.builder()
                    .version("latest")
                    .addon(addon).build()));
        }

        return "Database seeded";
    }
}
