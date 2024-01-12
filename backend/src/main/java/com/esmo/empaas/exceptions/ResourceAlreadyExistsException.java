package com.esmo.empaas.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT)
public class ResourceAlreadyExistsException extends RuntimeException {

    public ResourceAlreadyExistsException(String resourceName, String resourceKey, Object keyData) {
        super(String.format("Resource %s with key %s: %s already exists", resourceName, resourceKey, keyData));
    }
}
