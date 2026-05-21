package com.nvp.NiagaraViajesPedregal.controller;

import com.nvp.NiagaraViajesPedregal.service.PaqueteService;
import com.nvp.NiagaraViajesPedregal.service.TestimonioService;
import com.nvp.NiagaraViajesPedregal.service.UsuarioService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    private final UsuarioService usuarioService;
    private final PaqueteService paqueteService;
    private final TestimonioService testimonioService;
    public HomeController(UsuarioService usuarioService,
                          PaqueteService paqueteService,
                          TestimonioService testimonioService) {
        this.usuarioService = usuarioService;
        this.paqueteService = paqueteService;
        this.testimonioService = testimonioService;
    }

    /* ── Página pública ── */
    /* ── Página pública ── */
@GetMapping("/")
public String index(
        @AuthenticationPrincipal UserDetails userDetails,
        Model model) {

    if (userDetails != null) {
        usuarioService.buscarPorEmail(userDetails.getUsername())
                      .ifPresent(u -> model.addAttribute("usuario", u));
    }
    model.addAttribute("experiencias", paqueteService.listarActivos());
    model.addAttribute("testimonios",  testimonioService.listarActivos());
    return "index";
}

    /* ── Dashboard admin ── */
    @GetMapping("/dashboard")
    public String dashboard(
            @AuthenticationPrincipal UserDetails userDetails,
            Model model) {

        usuarioService.buscarPorEmail(userDetails.getUsername())
                      .ifPresent(u -> model.addAttribute("usuario", u));

        model.addAttribute("activePage",    "inicio");
        model.addAttribute("totalUsuarios", usuarioService.listarTodos().size());
        model.addAttribute("totalPaquetes", paqueteService.listarTodos().size());
        return "admin/dashboard";
    }

    /* ── Aviso de privacidad ── */
    @GetMapping("/privacidad")
    public String privacidad() {
        return "privacidad";
    }

}