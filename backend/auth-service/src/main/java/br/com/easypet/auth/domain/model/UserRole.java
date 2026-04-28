package br.com.easypet.auth.domain.model;

import lombok.Getter;

@Getter
public enum UserRole {
    ADMIN("ADMIN"),
    BUSINESS_OWNER("business_owner"),
    CUSTOMER("customer");

    private String role;

    UserRole(String role) {
        this.role = role;
    }
}
