package br.com.easypet.business.service;

import br.com.easypet.business.domain.entity.Pet;
import br.com.easypet.business.domain.entity.Vaccine;
import br.com.easypet.business.dto.request.VaccineRequest;
import br.com.easypet.business.dto.response.VaccineResponse;
import br.com.easypet.business.exception.ResourceNotFoundException;
import br.com.easypet.business.mapper.VaccineMapper;
import br.com.easypet.business.repository.PetRepository;
import br.com.easypet.business.repository.VaccineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VaccineService {

    private final VaccineRepository vaccineRepository;
    private final PetRepository petRepository;
    private final VaccineMapper vaccineMapper;

    @CacheEvict(value = "vaccines", key = "#petId")
    public VaccineResponse create(UUID petId, VaccineRequest request) {
        log.info("Iniciando cadastro de vacina '{}' para o pet ID: {}", request.name(), petId);

        Pet pet = findPetIfOwner(petId);
        Vaccine vaccine = vaccineMapper.toEntity(request, pet);
        Vaccine saved =  vaccineRepository.save(vaccine);
        log.info("Vacina cadastrada com sucesso! ID da vacina: {}", saved.getId());
        return vaccineMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<VaccineResponse> findAllByPet(UUID petId, Pageable pageable) {
        log.info("Buscando histórico de vacinas para o pet ID: {}", petId);

        findPetIfOwner(petId);
        return vaccineRepository.findAllByPetIdOrderByApplicationDateDesc(petId, pageable)
                .map(vaccineMapper::toResponse);
    }

    @CacheEvict(value = "vaccines", key = "#petId")
    public VaccineResponse update(UUID petId,UUID vaccineId, VaccineRequest request) {
        log.info("Atualizando vacina ID: {} para o pet ID: {}", vaccineId, petId);

        Pet pet = findPetIfOwner(petId);
        Vaccine vaccine = vaccineRepository.findById(vaccineId)
                .filter(v-> v.getPet().getId().equals(petId))
                .orElseThrow(()-> new ResourceNotFoundException("Vacina não encontrada para este pet"));

        updateVaccineFromRequest(vaccine, request);

        return vaccineMapper.toResponse(vaccineRepository.save(vaccine));
    }

    @CacheEvict(value = "vaccines", key = "#petId")
    public void delete(UUID petId, UUID vaccineId) {
        log.warn("Solicitação de exclusão da vacina ID: {} para o pet ID: {}", vaccineId, petId);

        findPetIfOwner(petId);
        vaccineRepository.deleteById(vaccineId);
        log.info("Vacina excluída com sucesso!");
    }

    @Transactional(readOnly = true)
    private Pet findPetIfOwner(UUID petId) {
        UUID currentUserId = getCurrentUserId();
        log.debug("Validando propriedade do pet: {} para o usuário: {}", petId, currentUserId);
        return petRepository.findById(petId)
                .filter(p -> p.getOwnerId().equals(currentUserId))
                .orElseThrow(()-> {
                    log.error("Tentativa de acesso negado ou pet inexistente: Pet {} | Usuário {}", petId, currentUserId);
                    return new ResourceNotFoundException("Pet não encontrado ou acesso negado");
                });
    }

    private UUID getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return UUID.fromString(authentication.getCredentials().toString());
    }

    private void updateVaccineFromRequest(Vaccine vaccine, VaccineRequest request) {
        vaccine.setName(request.name());
        vaccine.setApplicationDate(request.applicationDate());
        vaccine.setNextDoseDate(request.nextDoseDate());
        vaccine.setVetName(request.vetName());
        vaccine.setManufacturer(request.manufacturer());
        vaccine.setLot(request.lot());
        vaccine.setObservations(request.observations());
        vaccine.setStatus(request.status());
    }
}
