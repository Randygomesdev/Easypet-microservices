package br.com.easypet.business.repository;

import br.com.easypet.business.domain.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    Page<Appointment> findAllByPetIdOrderByDateDesc(UUID userId, Pageable pageable);
}
