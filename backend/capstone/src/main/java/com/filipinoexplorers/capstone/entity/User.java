package com.filipinoexplorers.capstone.entity;

public interface User {
    Long getId(); 
    String getEmail();
    String getPassword();
    Role getRole();
}
