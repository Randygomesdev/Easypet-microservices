package br.com.easypet.auth.controller;

import br.com.easypet.auth.dto.request.AuthenticationRequest;
import br.com.easypet.auth.dto.request.ForgotPasswordRequest;
import br.com.easypet.auth.dto.request.ResetPasswordRequest;
import br.com.easypet.auth.dto.response.AuthenticationResponse;
import br.com.easypet.auth.dto.request.RegisterRequest;
import br.com.easypet.auth.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication", description = "Endpoints para registro e login de usuários")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Registrar um novo usuário", description = "Cria um novo usuário no sistema e retorna um token JWT")
    public ResponseEntity<AuthenticationResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Recebida requisição de registro para o email: {}", request.email());
        AuthenticationResponse response = authService.register(request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand("me")
                .toUri();
        log.info("Usuário registrado com sucesso: {}", response.email());
        return ResponseEntity.created(uri).body(response);
    }

    @PostMapping("/login")
    @Operation(summary = "Autenticar um usuário", description = "Valida as credenciais e retorna um token JWT")
    public ResponseEntity<AuthenticationResponse> authenticate(@Valid @RequestBody AuthenticationRequest request) {
        log.info("Tentativa de login recebida para o email: {}", request.email());
        AuthenticationResponse response = authService.authenticate(request);
        log.info("Login realizado com sucesso para o usuário: {}", response.email());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Solicitar recuperação de senha", description = "Gera um token de recuperação e envia por e-mail para o usuário, caso o e-mail esteja cadastrado.")
    public ResponseEntity<Void> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Recebida requisição REST para forgot-password: {}", request.email());
        authService.forgotPassword(request.email());
        return ResponseEntity.ok().build();
    }
    @PostMapping("/reset-password")
    @Operation(summary = "Resetar senha do usuário", description = "Valida o token de recuperação e atualiza a senha do usuário no banco de dados.")
    public ResponseEntity<Void> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        log.info("Solicitação de reset de senha recebida com token");
        authService.resetPassword(request.token(), request.newPassword());
        log.info("Senha alterada com sucesso via reset de senha");
        return ResponseEntity.ok().build();
    }
}
