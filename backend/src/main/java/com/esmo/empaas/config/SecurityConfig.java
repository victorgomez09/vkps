package com.esmo.empaas.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.XXssProtectionHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	public final String[] PUBLIC_PATHS = { "/api/auth/**", "/", "/error", "/addons/**", "/applications/**" };

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(config -> {
			CorsConfiguration configuration = new CorsConfiguration();
			configuration.setAllowedOrigins(Arrays.asList("http://localhost:4200",
					"https://solid-goggles-4g9xjgp7497fj9g9-4200.app.github.dev"));
			configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
			configuration.setAllowedHeaders(List.of("*"));

			return configuration;
		})).csrf(csrf -> csrf.disable())
				.authorizeHttpRequests(
						auth -> auth.requestMatchers(PUBLIC_PATHS).permitAll().anyRequest().authenticated())
				.sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.headers(headers -> headers
						.xssProtection(
								xss -> xss.headerValue(XXssProtectionHeaderWriter.HeaderValue.ENABLED_MODE_BLOCK))
						.contentSecurityPolicy(cps -> cps.policyDirectives("script-src 'self'")));

		return http.build();
	}
}
