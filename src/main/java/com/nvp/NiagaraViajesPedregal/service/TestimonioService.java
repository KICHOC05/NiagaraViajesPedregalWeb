package com.nvp.NiagaraViajesPedregal.service;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface TestimonioService {
    List<Testimonio> listarTodos();
    List<Testimonio> listarActivos();
    Optional<Testimonio> buscarPorId(Long id);
    Testimonio guardar(Testimonio testimonio, MultipartFile imagen);
    Testimonio actualizar(Long id, Testimonio datos, MultipartFile imagen);
    void eliminar(Long id);
    void toggleActivo(Long id);
}