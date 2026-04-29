package br.com.easypet.business.dto.response;

import br.com.easypet.business.domain.model.MedicalType;

import java.time.LocalDate;
import java.util.UUID;

public record MedicalRecordResponse(
        UUID id,
        LocalDate date,
        MedicalType medicalType,
        String description,
        String vetName,
        String diagnosis,
        String prescription
) {
}
