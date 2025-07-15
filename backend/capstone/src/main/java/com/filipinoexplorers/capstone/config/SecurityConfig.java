package com.filipinoexplorers.capstone.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import static org.springframework.security.config.Customizer.withDefaults;

import com.filipinoexplorers.capstone.service.JwtAuthFilter;
import com.filipinoexplorers.capstone.service.CustomUserDetailsService;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF for APIs using JWT
            .cors(withDefaults()) // Enable CORS (cross-origin resource sharing)
         .authorizeHttpRequests(authz -> authz
            .requestMatchers("/api/auth/register", "/api/auth/login", "/api/group-games/**", "/api/auth/profile-picture").permitAll()
            .requestMatchers("/api/group-progress/**", "/api/class-records/**").permitAll()
            .requestMatchers("/api/auth/change-password").authenticated()

            .requestMatchers("/api/words/get").permitAll()
            
            // Teacher routes
            .requestMatchers("/api/gamesessions/**").hasAnyRole("TEACHER", "STUDENT")
            .requestMatchers("/api/teacher-dashboard/**").hasRole("TEACHER")
            .requestMatchers("/api/classes/**").hasAnyRole("TEACHER" ,"STUDENT")
            .requestMatchers("/api/classroom/**").hasRole("TEACHER")
            .requestMatchers("/api/progress-tracking/**").hasAnyRole("TEACHER", "STUDENT")


            // Student routes
            .requestMatchers("/api/classes/join").hasRole("STUDENT")
            .requestMatchers("/api/classes/student/joined").hasRole("STUDENT")

            // Permit all for memory game API endpoints to avoid 403
            .requestMatchers("/api/session/**").permitAll()
            .requestMatchers("/api/questions/**").permitAll()
            
            .anyRequest().authenticated()
    ).addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class); 

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManager.class);
    }
}
