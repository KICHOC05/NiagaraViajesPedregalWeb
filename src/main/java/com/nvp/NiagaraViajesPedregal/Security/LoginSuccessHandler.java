package com.nvp.NiagaraViajesPedregal.Security;

import com.nvp.NiagaraViajesPedregal.service.UsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
public class LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UsuarioService usuarioService;

    public LoginSuccessHandler(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest  request,
            HttpServletResponse response,
            Authentication      auth) throws IOException {

        boolean isAdmin = auth.getAuthorities()
                .contains(new SimpleGrantedAuthority("ROLE_ADMIN"));

        String email  = auth.getName();
        String nombre = usuarioService.buscarPorEmail(email)
                .map(u -> u.getNombre().split(" ")[0])  // solo primer nombre
                .orElse("Viajero");

        String encoded = URLEncoder.encode(nombre, StandardCharsets.UTF_8);

        if (isAdmin) {
            response.sendRedirect("/dashboard");
        } else {
            response.sendRedirect("/?welcome=" + encoded);
        }
    }
}