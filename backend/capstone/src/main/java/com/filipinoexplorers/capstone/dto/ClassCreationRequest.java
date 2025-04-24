package com.filipinoexplorers.capstone.dto;

import lombok.Data;

@Data
public class ClassCreationRequest {
    private String name;
    private String description;
    private String enrollmentMethod;
    private String bannerUrl;
}
