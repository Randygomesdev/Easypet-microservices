package br.com.easypet.business.dto.request;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.UUID;

public record MedicationRequest(

    @NotBlank 
    String name,

    @NotBlank 
    String dosage,

    @NotBlank 
    String frequency,

    LocalDate startDate,

    LocalDate endDate,

    String observations,

    Boolean active,
    
    UUID appointmentId
) {}
