package com.esmo.empaas.exceptions;

public class ResourceAlreadyExistsException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ResourceAlreadyExistsException(String resourceName, String resourceKey, Object keyData) {
		super(String.format("Resource %s with key %s: %s already exists", resourceName, resourceKey, keyData));
	}
}
