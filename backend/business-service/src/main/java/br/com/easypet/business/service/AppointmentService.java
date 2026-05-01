package br.com.easypet.business.service;

import br.com.easypet.business.domain.entity.Appointment;
import br.com.easypet.business.domain.entity.Pet;
import br.com.easypet.business.dto.request.AppointmentRequest;
import br.com.easypet.business.dto.response.AppointmentResponse;
import br.com.easypet.business.exception.ResourceNotFoundException;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.annotation.Transactional;

import br.com.easypet.business.mapper.AppointmentMapper;
import br.com.easypet.business.repository.AppointmentRepository;
import br.com.easypet.business.repository.PetRepository;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final AppointmentMapper appointmentMapper;
    private final PetRepository petRepository;

    @CacheEvict(value = "appointments", key = "#petId")
    public AppointmentResponse create(UUID petId, AppointmentRequest request) {
        log.info("Registrando consulta para o pet ID: {} | Motivo: {}", petId, request.reason());
        Pet pet = findPetIfOwner(petId);
        Appointment appointment = appointmentMapper.toEntity(request, pet);

        if (request.weightAtTime() != null) {
            pet.setWeight(request.weightAtTime());
            petRepository.save(pet);
        }

        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "appointments", key = "#petId")
    public Page<AppointmentResponse> findAllByPet(UUID petId, Pageable pageable) {
        log.info("Buscando consultas no BANCO para o pet: {} (e salvando no Redis)", petId);
        findPetIfOwner(petId);
        return appointmentRepository.findAllByPetIdOrderByDateDesc(petId, pageable)
                .map(appointmentMapper::toResponse);
    }

    @CacheEvict(value = "appointments", key = "#petId")
    public AppointmentResponse update(UUID petId, UUID appointmentId, AppointmentRequest request) {
        log.info("Atualizando consulta ID: {} do pet ID: {}", appointmentId, petId);
        findPetIfOwner(petId);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .filter(a -> a.getPet().getId().equals(petId))
                .orElseThrow(() -> new ResourceNotFoundException("Consulta não encontrada para este pet"));
        updateAppointmentFromRequest(appointment, request);
        return appointmentMapper.toResponse(appointmentRepository.save(appointment));
    }

    @CacheEvict(value = "appointments", key = "#petId")
    public void delete(UUID petId, UUID appointmentId) {
        log.warn("Excluindo registro de consulta ID: {} do pet ID: {}", appointmentId, petId);
        findPetIfOwner(petId);
        appointmentRepository.deleteById(appointmentId);
    }

    @Transactional(readOnly = true)
    private Pet findPetIfOwner(UUID petId) {
        UUID currentUserId = getCurrentUserId();
        return petRepository.findById(petId)
                .filter(p -> p.getOwnerId().equals(currentUserId))
                .orElseThrow(() -> new ResourceNotFoundException("Pet não encontrado ou acesso negado"));
    }
    private UUID getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return UUID.fromString(authentication.getCredentials().toString());
    }
    private void updateAppointmentFromRequest(Appointment appointment, AppointmentRequest request) {
        appointment.setDate(request.date());
        appointment.setReason(request.reason());
        appointment.setClinicalNotes(request.clinicalNotes());
        appointment.setVetName(request.vetName());
        appointment.setProviderId(request.providerId());
        appointment.setWeightAtTime(request.weightAtTime());
        appointment.setStatus(request.status());
    }
}
