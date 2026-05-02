package br.com.easypet.business.dto.response;

import java.time.LocalDate;
import java.util.UUID;

public record WeightRecordResponse(
        UUID id,
        LocalDate date,
        Double weight
) {
}
