package br.com.easypet.business.service;

import br.com.easypet.business.domain.entity.Pet;
import br.com.easypet.business.dto.request.PetRequest;
import br.com.easypet.business.dto.response.PetResponse;
import br.com.easypet.business.exception.ResourceNotFoundException;
import br.com.easypet.business.mapper.PetMapper;
import br.com.easypet.business.repository.PetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class PetService {

    private final PetRepository petRepository;
    private final PetMapper petMapper;

    @Transactional
    public PetResponse create(PetRequest request){
        UUID ownerId = getCurrentUserId();
        log.info("Cadastrando novo pet para o dono: {}", ownerId);
        Pet pet = petMapper.toEntity(request, ownerId);
        return petMapper.toResponse(petRepository.save(pet));
    }

    public Page<PetResponse> findAllByOwner(Pageable pageable){
        UUID ownerId = getCurrentUserId();
        log.info("Listando pets para o dono: {}", ownerId);
        return petRepository.findByOwnerIdAndActiveTrue(ownerId, pageable)
                .map(petMapper::toResponse);
    }

    public PetResponse update(UUID id, PetRequest request){
        Pet pet = findPetByIdAndOwner(id);
        log.info("Atualizando informações do pet: {}", pet.getName());
        petMapper.updateEntityFromRequest(request, pet);
        Pet updatedPet = petRepository.save(pet);
        return petMapper.toResponse(updatedPet);
    }

    public void delete(UUID id){
        UUID ownerId = getCurrentUserId();
        log.info("Removendo pet para o dono: {}", ownerId);
        Pet pet = findPetByIdAndOwner(id);
        pet.setActive(false);
        petRepository.save(pet);
    }

    private Pet findPetByIdAndOwner(UUID id){
        UUID ownerId = getCurrentUserId();
        return petRepository.findById(id)
                .filter(p -> p.getOwnerId().equals(ownerId))
                .orElseThrow(()-> new ResourceNotFoundException("Pet não encontrado ou você não tem permissão"));
    }

    private UUID getCurrentUserId() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        return UUID.fromString(authentication.getCredentials().toString());
    }

}
