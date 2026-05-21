package com.nvp.NiagaraViajesPedregal.service;

import com.nvp.NiagaraViajesPedregal.domain.model.Usuario;

import java.util.List;
import java.util.Optional;

public interface UsuarioService {
    Usuario registrar(String nombre, String email, String password);
    Optional<Usuario> buscarPorId(Long id);
    Optional<Usuario> buscarPorEmail(String email);
    boolean existeEmail(String email);
    List<Usuario> listarTodos();
    Usuario actualizar(Long id, String nombre, String email, String rol, boolean activo);
    void cambiarPassword(Long id, String passwordActual, String passwordNueva);
    void cambiarPasswordAdmin(Long id, String passwordNueva);
    void eliminar(Long id);
}