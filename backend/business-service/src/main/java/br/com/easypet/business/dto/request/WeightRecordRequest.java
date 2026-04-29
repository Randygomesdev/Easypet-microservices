package br.com.easypet.business.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record WeightRecordRequest(

        @NotNull
        LocalDate date,

        @NotNull
        Double weight
) {
}
