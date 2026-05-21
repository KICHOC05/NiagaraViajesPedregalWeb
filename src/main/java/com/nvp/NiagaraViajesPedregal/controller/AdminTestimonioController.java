package com.nvp.NiagaraViajesPedregal.controller;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;
import com.nvp.NiagaraViajesPedregal.service.TestimonioService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dashboard/testimonios")
@PreAuthorize("hasRole('ADMIN')")
public class AdminTestimonioController {

    private final TestimonioService testimonioService;

    public AdminTestimonioController(TestimonioService testimonioService) {
        this.testimonioService = testimonioService;
    }

    /* ── Lista ── */
    @GetMapping
    public String lista(Model model) {
        model.addAttribute("testimonios", testimonioService.listarTodos());
        model.addAttribute("activePage",  "testimonios");
        return "admin/testimonios/lista";
    }

    /* ── Formulario CREAR ── */
    @GetMapping("/nuevo")
    public String nuevoForm(Model model) {
        model.addAttribute("testimonio", new Testimonio());
        model.addAttribute("activePage", "testimonios");
        model.addAttribute("accion",     "crear");
        return "admin/testimonios/form";
    }

    /* ── POST CREAR ── */
    @PostMapping("/nuevo")
    public String crear(@ModelAttribute Testimonio testimonio,
                        RedirectAttributes ra) {
        try {
            testimonioService.guardar(testimonio);
            ra.addFlashAttribute("success", "Testimonio creado correctamente.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", "Error al crear: " + e.getMessage());
        }
        return "redirect:/dashboard/testimonios";
    }

    /* ── Formulario EDITAR ── */
    @GetMapping("/{id}/editar")
    public String editarForm(@PathVariable Long id, Model model,
                             RedirectAttributes ra) {
        return testimonioService.buscarPorId(id).map(t -> {
            model.addAttribute("testimonio", t);
            model.addAttribute("activePage", "testimonios");
            model.addAttribute("accion",     "editar");
            return "admin/testimonios/form";
        }).orElseGet(() -> {
            ra.addFlashAttribute("error", "Testimonio no encontrado.");
            return "redirect:/dashboard/testimonios";
        });
    }

    /* ── POST EDITAR ── */
    @PostMapping("/{id}/editar")
    public String editar(@PathVariable Long id,
                         @ModelAttribute Testimonio testimonio,
                         RedirectAttributes ra) {
        try {
            testimonioService.actualizar(id, testimonio);
            ra.addFlashAttribute("success", "Testimonio actualizado correctamente.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", "Error al actualizar: " + e.getMessage());
        }
        return "redirect:/dashboard/testimonios";
    }

    /* ── Toggle activo ── */
    @PostMapping("/{id}/toggle")
    public String toggle(@PathVariable Long id, RedirectAttributes ra) {
        testimonioService.toggleActivo(id);
        ra.addFlashAttribute("success", "Estado del testimonio actualizado.");
        return "redirect:/dashboard/testimonios";
    }

    /* ── Eliminar ── */
    @PostMapping("/{id}/eliminar")
    public String eliminar(@PathVariable Long id, RedirectAttributes ra) {
        try {
            testimonioService.eliminar(id);
            ra.addFlashAttribute("success", "Testimonio eliminado correctamente.");
        } catch (Exception e) {
            ra.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/dashboard/testimonios";
    }
}