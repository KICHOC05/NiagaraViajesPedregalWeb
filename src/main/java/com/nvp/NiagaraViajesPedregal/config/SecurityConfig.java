package com.nvp.NiagaraViajesPedregal.config;

import com.nvp.NiagaraViajesPedregal.Security.CustomUserDetailsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /* ══════════════════════════════════════
       Handler de éxito: separa ADMIN / USER
    ══════════════════════════════════════ */
    @Bean
    public AuthenticationSuccessHandler successHandler() {
        return new AuthenticationSuccessHandler() {
            @Override
            public void onAuthenticationSuccess(
                    HttpServletRequest request,
                    HttpServletResponse response,
                    Authentication auth) throws IOException {

                boolean isAdmin = auth.getAuthorities()
                        .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

                // Obtener nombre del usuario autenticado
                String email   = auth.getName();
                String nombre  = extractNombre(email);
                String encoded = URLEncoder.encode(nombre, StandardCharsets.UTF_8);

                if (isAdmin) {
                    // Admin → dashboard
                    response.sendRedirect("/dashboard");
                } else {
                    // Usuario normal → index con toast de bienvenida
                    response.sendRedirect("/?welcome=" + encoded);
                }
            }

            /** Intenta obtener solo el primer nombre del email */
            private String extractNombre(String email) {
                // Spring Security usa el email como username;
                // el nombre real lo buscamos en el contexto del hilo si está disponible
                // Como fallback usamos la parte antes del @
                String local = email.contains("@") ? email.split("@")[0] : email;
                return local.substring(0, 1).toUpperCase() + local.substring(1);
            }
        };
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .authenticationProvider(authProvider())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/", "/login", "/registro", "/privacidad",
                    "/css/**", "/js/**", "/img/**", "/favicon.ico"
                ).permitAll()
                .requestMatchers("/dashboard/**").hasAnyRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login")
                .usernameParameter("email")
                .passwordParameter("password")
                .successHandler(successHandler())   // ← handler personalizado
                .failureUrl("/login?error")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login?logout")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .rememberMe(remember -> remember
                .key("nvp-remember-key-2024-secret")
                .tokenValiditySeconds(86_400 * 7)
                .userDetailsService(userDetailsService)
                .rememberMeParameter("remember-me")
            );

        return http.build();
    }
}