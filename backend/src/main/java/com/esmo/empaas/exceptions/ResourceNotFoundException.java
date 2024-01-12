package com.esmo.empaas.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String resourceKey, Object keyData) {
        super(String.format("Resource %s with key %s: %s not found", resourceName, resourceKey, keyData));
    }
}
