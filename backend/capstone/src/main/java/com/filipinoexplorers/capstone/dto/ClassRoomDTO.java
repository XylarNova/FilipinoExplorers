package com.filipinoexplorers.capstone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassRoomDTO {
    private Long id;
    private String name;
    private String description;
    private String enrollmentMethod;
    private String bannerUrl;
    private String classCode;
    private String teacherFirstName;
    private String teacherLastName;
}
// new DTO class for ClassRoom
// This class is used to transfer classroom data, including teacher's first and last names.