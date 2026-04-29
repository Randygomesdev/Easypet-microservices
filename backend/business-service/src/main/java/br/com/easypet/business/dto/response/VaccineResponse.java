package br.com.easypet.business.dto.response;

import br.com.easypet.business.domain.model.VaccineStatus;

import java.time.LocalDate;
import java.util.UUID;

public record VaccineResponse(
        UUID id,
        String name,
        LocalDate applicationDate,
        LocalDate nextDoseDate,
        VaccineStatus status,
        String vetName,
        String manufacturer,
        String lot,
        String observations
) {
}
