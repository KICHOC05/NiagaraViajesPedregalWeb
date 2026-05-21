package com.nvp.NiagaraViajesPedregal.repository;

import com.nvp.NiagaraViajesPedregal.domain.model.Testimonio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestimonioRepository extends JpaRepository<Testimonio, Long> {
    List<Testimonio> findByActivoTrueOrderByOrdenAsc();
    List<Testimonio> findAllByOrderByOrdenAscCreatedAtDesc();
}