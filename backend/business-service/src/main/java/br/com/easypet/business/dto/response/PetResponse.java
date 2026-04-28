package br.com.easypet.business.dto.response;

import br.com.easypet.business.domain.model.PetGender;
import br.com.easypet.business.domain.model.PetSpecies;

import java.time.LocalDate;
import java.util.UUID;

public record PetResponse(
        UUID id,
        String name,
        String microchipNumber,
        PetSpecies species,
        String breed,
        PetGender gender,
        Double weight,
        LocalDate birthDate,
        String pictureUrl,
        Boolean active,
        UUID ownerId
) {}

