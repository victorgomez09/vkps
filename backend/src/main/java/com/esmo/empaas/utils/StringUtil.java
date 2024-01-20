package com.esmo.empaas.utils;

import org.springframework.stereotype.Component;

@Component
public class StringUtil {

	public String parseName(String name) {
		return name.replaceAll("\\s+","-");
	}
}
