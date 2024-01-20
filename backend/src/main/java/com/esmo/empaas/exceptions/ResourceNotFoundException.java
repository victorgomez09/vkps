package com.esmo.empaas.exceptions;

public class ResourceNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;
	
	public ResourceNotFoundException(String resourceName, String resourceKey, Object keyData) {
		super(String.format("Resource %s with key %s: %s not found", resourceName, resourceKey, keyData));
	}
}
