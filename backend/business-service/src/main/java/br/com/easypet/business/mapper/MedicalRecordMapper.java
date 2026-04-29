package br.com.easypet.business.mapper;

import br.com.easypet.business.domain.entity.MedicalRecord;
import br.com.easypet.business.domain.entity.Pet;
import br.com.easypet.business.dto.request.MedicalRecordRequest;
import br.com.easypet.business.dto.response.MedicalRecordResponse;
import org.springframework.stereotype.Component;

@Component
public class MedicalRecordMapper {

    public MedicalRecord toEntity(MedicalRecordRequest request, Pet pet) {
        return MedicalRecord.builder()
                .pet(pet)
                .date(request.date())
                .medicalType(request.medicalType())
                .description(request.description())
                .vetName(request.vetName())
                .diagnosis(request.diagnosis())
                .prescription(request.prescription())
                .build();
    }

    public MedicalRecordResponse toResponse(MedicalRecord record) {
        return new MedicalRecordResponse(
                record.getId(),
                record.getDate(),
                record.getMedicalType(),
                record.getDescription(),
                record.getVetName(),
                record.getDiagnosis(),
                record.getPrescription()
        );
    }
}
