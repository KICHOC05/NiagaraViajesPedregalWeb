package com.nvp.NiagaraViajesPedregal.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "testimonios")
public class Testimonio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false, length = 100)
    private String nombre;          // "Patricia Jiménez"

    @NotBlank
    @Size(max = 500)
    @Column(nullable = false, length = 500)
    private String texto;           // El testimonio completo

    // "Retiro Corporativo · Oaxaca"
    @Size(max = 150)
    @Column(length = 150)
    private String viaje;

    // 1-5 estrellas
    @Column(nullable = false)
    private int estrellas = 5;

    @Column(nullable = false)
    private boolean activo = true;

    @Column(nullable = false)
    private int orden = 0;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    /* ── Constructores ── */
    public Testimonio() {}

    /* ── Getters y Setters ── */
    public Long getId()                       { return id; }
    public void setId(Long id)                { this.id = id; }

    public String getNombre()                 { return nombre; }
    public void setNombre(String n)           { this.nombre = n; }

    public String getTexto()                  { return texto; }
    public void setTexto(String t)            { this.texto = t; }

    public String getViaje()                  { return viaje; }
    public void setViaje(String v)            { this.viaje = v; }

    public int getEstrellas()                 { return estrellas; }
    public void setEstrellas(int e)           { this.estrellas = e; }

    public boolean isActivo()                 { return activo; }
    public void setActivo(boolean a)          { this.activo = a; }

    public int getOrden()                     { return orden; }
    public void setOrden(int o)               { this.orden = o; }

    public LocalDateTime getCreatedAt()       { return createdAt; }
    public void setCreatedAt(LocalDateTime c) { this.createdAt = c; }

    public LocalDateTime getUpdatedAt()       { return updatedAt; }
    public void setUpdatedAt(LocalDateTime u) { this.updatedAt = u; }

    /* Helper: inicial del nombre para el avatar */
    public String getInicial() {
        if (nombre == null || nombre.isBlank()) return "?";
        return String.valueOf(nombre.charAt(0)).toUpperCase();
    }

    /* Helper: genera las estrellas como String */
    public String getEstrellasStr() {
        return "★".repeat(Math.max(0, Math.min(5, estrellas)));
    }
}