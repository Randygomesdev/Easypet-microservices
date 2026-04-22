package br.com.easypet.auth.service;

import br.com.easypet.auth.domain.entity.User;
import br.com.easypet.auth.domain.model.UserRole;
import br.com.easypet.auth.dto.request.AuthenticationRequest;
import br.com.easypet.auth.dto.request.RegisterRequest;
import br.com.easypet.auth.dto.response.AuthenticationResponse;
import br.com.easypet.auth.exception.AuthException;
import br.com.easypet.auth.repository.UserRepository;
import br.com.easypet.auth.security.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Iniciando registro de usuário: {}", request.email());

        if (userRepository.findByEmail(request.email()).isPresent()) {
            log.warn("Tentativa de registro com email já existente: {}", request.email());
            throw new AuthException("Este email já está cadastrado");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.CUSTOMER)
                .active(true)
                .build();
        userRepository.save(user);
        log.info("Usuário cadastrado com sucesso: {}", request.email());

        String jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPictureUrl()
        );
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Tentativa de login para o usuário: {}", request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()
                )
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(()-> new AuthException("Usuário não encontrado"));

        log.info("Login realizado com sucesso: {}", request.email());

        String jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getPictureUrl()
                );
    }

}
