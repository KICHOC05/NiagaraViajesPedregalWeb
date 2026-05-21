package com.nvp.NiagaraViajesPedregal.service;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;

import java.util.List;
import java.util.Optional;

public interface TestimonioService {
    List<Testimonio> listarTodos();
    List<Testimonio> listarActivos();
    Optional<Testimonio> buscarPorId(Long id);
    Testimonio guardar(Testimonio testimonio);
    Testimonio actualizar(Long id, Testimonio datos);
    void eliminar(Long id);
    void toggleActivo(Long id);
}