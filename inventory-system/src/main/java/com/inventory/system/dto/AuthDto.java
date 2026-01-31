package com.inventory.system.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

public class AuthDto {

    @Data
    public static class LoginRequest {
        @NotBlank
        private String username;
        @NotBlank
        private String password;
    }

    @Data
    public static class RegisterRequest {
        @NotBlank
        private String username;
        @NotBlank
        @Email
        private String email;
        @NotBlank
        private String password;
        private Set<String> roles;
    }

    @Data
    public static class JwtResponse {
        private String accessToken;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private Set<String> roles;

        public JwtResponse(String accessToken, Long id, String username, String email, Set<String> roles) {
            this.accessToken = accessToken;
            this.id = id;
            this.username = username;
            this.email = email;
            this.roles = roles;
        }
    }
}
