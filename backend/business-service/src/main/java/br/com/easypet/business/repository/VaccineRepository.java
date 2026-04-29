package br.com.easypet.business.repository;

import br.com.easypet.business.domain.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface VaccineRepository extends JpaRepository<Vaccine, UUID> {

    List<Vaccine> findAllByPetIdOrderByApplicationDateDesc(UUID petId);
}
