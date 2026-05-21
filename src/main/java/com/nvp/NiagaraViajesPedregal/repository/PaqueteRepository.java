package com.nvp.NiagaraViajesPedregal.repository;

import com.nvp.NiagaraViajesPedregal.domain.model.Paquete;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaqueteRepository extends JpaRepository<Paquete, Long> {

    List<Paquete> findByActivoTrueOrderByOrdenAsc();

    List<Paquete> findAllByOrderByOrdenAscCreatedAtDesc();
}