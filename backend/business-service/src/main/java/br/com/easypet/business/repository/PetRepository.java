package br.com.easypet.business.repository;

import br.com.easypet.business.domain.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PetRepository extends JpaRepository<Pet, UUID> {

    Page<Pet> findByOwnerIdAndActiveTrue(UUID ownerId, Pageable pageable);
}
