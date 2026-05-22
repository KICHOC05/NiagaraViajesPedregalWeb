package com.nvp.NiagaraViajesPedregal.service.impl;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;
import com.nvp.NiagaraViajesPedregal.repository.TestimonioRepository;
import com.nvp.NiagaraViajesPedregal.service.CloudinaryService;
import com.nvp.NiagaraViajesPedregal.service.TestimonioService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TestimonioServiceImpl implements TestimonioService {

    private static final Logger log =
            LoggerFactory.getLogger(TestimonioServiceImpl.class);

    private final TestimonioRepository testimonioRepository;
    private final CloudinaryService    cloudinaryService;

    @Value("${cloudinary.folder:niagara-viajes}")
    private String folder;

    public TestimonioServiceImpl(TestimonioRepository testimonioRepository,
                                 CloudinaryService cloudinaryService) {
        this.testimonioRepository = testimonioRepository;
        this.cloudinaryService    = cloudinaryService;
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
    public Testimonio guardar(Testimonio testimonio, MultipartFile imagen) {
        subirImagenSiExiste(testimonio, imagen, null);
        log.info("Guardando nuevo testimonio de: {}", testimonio.getNombre());
        return testimonioRepository.save(testimonio);
    }

    @Override
    @Transactional
    public Testimonio actualizar(Long id, Testimonio datos, MultipartFile imagen) {
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

        subirImagenSiExiste(existing, imagen, existing.getImagenPublicId());

        log.info("Actualizando testimonio ID {}: {}", id, existing.getNombre());
        return testimonioRepository.save(existing);
    }

    @Override
    @Transactional
    public void eliminar(Long id) {
        Testimonio t = testimonioRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Testimonio no encontrado con ID: " + id));
        cloudinaryService.delete(t.getImagenPublicId());
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

    /* ── Sube imagen si se proporcionó, elimina la anterior si existe ── */
    private void subirImagenSiExiste(Testimonio testimonio,
                                     MultipartFile imagen,
                                     String publicIdAnterior) {
        if (imagen == null || imagen.isEmpty()) return;
        try {
            if (publicIdAnterior != null && !publicIdAnterior.isBlank()) {
                cloudinaryService.delete(publicIdAnterior);
            }
            Map<String, String> resultado =
                    cloudinaryService.upload(imagen, folder + "/testimonios");
            testimonio.setImagenUrl(resultado.get("url"));
            testimonio.setImagenPublicId(resultado.get("public_id"));
        } catch (Exception e) {
            log.error("Error procesando imagen para testimonio '{}': {}",
                    testimonio.getNombre(), e.getMessage());
            throw new RuntimeException("Error al procesar la imagen: " + e.getMessage());
        }
    }
}