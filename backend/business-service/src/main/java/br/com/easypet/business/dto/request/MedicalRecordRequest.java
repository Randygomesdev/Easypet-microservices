package br.com.easypet.business.dto.request;

import br.com.easypet.business.domain.model.MedicalType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record MedicalRecordRequest(

        @NotNull
        LocalDate date,

        @NotNull
        MedicalType medicalType,

        @NotBlank
        String description,
        String vetName,
        String diagnosis,
        String prescription
) {
}
