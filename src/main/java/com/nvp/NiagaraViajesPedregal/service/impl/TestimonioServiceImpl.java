package com.nvp.NiagaraViajesPedregal.service.impl;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;
import com.nvp.NiagaraViajesPedregal.repository.TestimonioRepository;
import com.nvp.NiagaraViajesPedregal.service.TestimonioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TestimonioServiceImpl implements TestimonioService {

    private static final Logger log =
            LoggerFactory.getLogger(TestimonioServiceImpl.class);

    private final TestimonioRepository testimonioRepository;

    public TestimonioServiceImpl(TestimonioRepository testimonioRepository) {
        this.testimonioRepository = testimonioRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Testimonio> listarTodos() {
        return testimonioRepository.findAllByOrderByOrdenAscCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Testimonio> listarActivos() {
        return testimonioRepository.findByActivoTrueOrderByOrdenAsc();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Testimonio> buscarPorId(Long id) {
        return testimonioRepository.findById(id);
    }

    @Override
    @Transactional
    public Testimonio guardar(Testimonio testimonio) {
        log.info("Guardando nuevo testimonio de: {}", testimonio.getNombre());
        return testimonioRepository.save(testimonio);
    }

    @Override
    @Transactional
    public Testimonio actualizar(Long id, Testimonio datos) {
        Testimonio existing = testimonioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Testimonio no encontrado con ID: " + id));

        existing.setNombre(datos.getNombre());
        existing.setTexto(datos.getTexto());
        existing.setViaje(datos.getViaje());
        existing.setEstrellas(datos.getEstrellas());
        existing.setOrden(datos.getOrden());
        existing.setActivo(datos.isActivo());
        existing.setUpdatedAt(LocalDateTime.now());

        log.info("Actualizando testimonio ID {}: {}", id, existing.getNombre());
        return testimonioRepository.save(existing);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Testimonio t = testimonioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Testimonio no encontrado con ID: " + id));
        testimonioRepository.deleteById(id);
        log.info("Testimonio eliminado — ID: {} | nombre: {}", id, t.getNombre());
    }

    @Override
    @Transactional
    public void toggleActivo(Long id) {
        Testimonio t = testimonioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Testimonio no encontrado con ID: " + id));
        t.setActivo(!t.isActivo());
        t.setUpdatedAt(LocalDateTime.now());
        testimonioRepository.save(t);
        log.info("Toggle activo — ID: {} | activo: {}", id, t.isActivo());
    }
}