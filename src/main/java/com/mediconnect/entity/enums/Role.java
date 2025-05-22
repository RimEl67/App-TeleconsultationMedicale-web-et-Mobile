package com.mediconnect.entity.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    PATIENT,
    DOCTOR,
    ADMIN;

    @JsonCreator
    public static Role fromString(String value) {
        return value == null ? null : Role.valueOf(value.toUpperCase());
    }
}
