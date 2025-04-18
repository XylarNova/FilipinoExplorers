package com.filipinoexplorers.capstone.service;

import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.filipinoexplorers.capstone.entity.Student;
import com.filipinoexplorers.capstone.entity.Teacher;
import com.filipinoexplorers.capstone.repository.StudentRepository;
import com.filipinoexplorers.capstone.repository.TeacherRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final TeacherRepository teacherRepo;
    private final StudentRepository studentRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<? extends UserDetails> user =
            teacherRepo.findByEmail(email).map(this::toUserDetails)
            .or(() -> studentRepo.findByEmail(email).map(this::toUserDetails));

        return user.orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private UserDetails toUserDetails(Teacher teacher) {
        return org.springframework.security.core.userdetails.User
                .withUsername(teacher.getEmail())
                .password(teacher.getPassword())
                .roles(teacher.getRole().name())
                .build();
    }

    private UserDetails toUserDetails(Student student) {
        return org.springframework.security.core.userdetails.User
                .withUsername(student.getEmail())
                .password(student.getPassword())
                .roles(student.getRole().name())
                .build();
    }
}
