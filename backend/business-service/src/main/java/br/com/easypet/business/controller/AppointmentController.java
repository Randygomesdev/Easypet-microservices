package br.com.easypet.business.controller;

import br.com.easypet.business.dto.request.AppointmentRequest;
import br.com.easypet.business.dto.response.AppointmentResponse;
import br.com.easypet.business.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/pets/{petId}/appointments")
@RequiredArgsConstructor
@Tag(name = "Consultas", description = "Gerenciamento de consultas veterinárias")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Registrar uma nova consulta")
    public ResponseEntity<AppointmentResponse> create(@PathVariable UUID petId, @Valid @RequestBody AppointmentRequest request) {
        AppointmentResponse response = appointmentService.create(petId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar histórico de consultas (paginado)")
    public ResponseEntity<Page<AppointmentResponse>> findAll(@PathVariable UUID petId, @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(appointmentService.findAllByPet(petId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados de uma consulta")
    public ResponseEntity<AppointmentResponse> update(@PathVariable UUID petId, @PathVariable UUID id, @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.update(petId, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover registro de consulta")
    public ResponseEntity<Void> delete(@PathVariable UUID petId, @PathVariable UUID id) {
        appointmentService.delete(petId, id);
        return ResponseEntity.noContent().build();
    }
}
