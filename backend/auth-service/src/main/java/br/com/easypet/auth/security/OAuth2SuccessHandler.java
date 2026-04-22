package br.com.easypet.auth.security;

import br.com.easypet.auth.domain.entity.User;
import br.com.easypet.auth.exception.UserNotFoundException;
import br.com.easypet.auth.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        // 1. Pegamos o usuário que o Google acabou de autenticar
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");

        // 2. Buscamos ele no nosso banco de dados (que acabamos de salvar no CustomOAuth2UserService)
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("Usuário com email " + email + " não encontrado"));

        // 3. Geramos o nosso próprio Token JWT do Easypet
        String token = jwtService.generateToken(user);

        // 4. Redirecionamos para o Frontend enviando o token via URL
        // (Isso é o padrão em arquiteturas Stateless para que o Angular receba o token)
        String targetUrl = UriComponentsBuilder.fromUriString("http://localhost:4200/login-success")
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
        log.info("Login social bem-sucedido para o email: {}. Redirecionando para o frontend.", email);
    }
}
