package br.com.easypet.business.mapper;

import br.com.easypet.business.domain.entity.Appointment;
import br.com.easypet.business.domain.entity.Medication;
import br.com.easypet.business.domain.entity.Pet;
import br.com.easypet.business.dto.request.MedicationRequest;
import br.com.easypet.business.dto.response.MedicationResponse;
import org.springframework.stereotype.Component;

@Component
public class MedicationMapper {

    public Medication toEntity(MedicationRequest request, Pet pet, Appointment appointment) {
        return Medication.builder()
                .pet(pet)
                .appointment(appointment)
                .name(request.name())
                .dosage(request.dosage())
                .frequency(request.frequency())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .observations(request.observations())
                .active(request.active())
                .build();
    }

    public MedicationResponse toResponse(Medication entity) {
        return new MedicationResponse(
                entity.getId(),
                entity.getName(),
                entity.getDosage(),
                entity.getFrequency(),
                entity.getStartDate(),
                entity.getEndDate(),
                entity.getObservations(),
                entity.getActive(),
                entity.getAppointment() != null ? entity.getAppointment().getId() : null
        );
    }
}
