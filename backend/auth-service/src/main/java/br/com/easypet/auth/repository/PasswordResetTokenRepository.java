package br.com.easypet.auth.repository;

import br.com.easypet.auth.domain.entity.PasswordResetToken;
import br.com.easypet.auth.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken,String> {

    Optional<PasswordResetToken> findByToken(String token);
    void deleteByUser(User user);

}
