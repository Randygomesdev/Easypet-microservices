package br.com.easypet.business.controller;

import br.com.easypet.business.dto.request.SurgeryRequest;
import br.com.easypet.business.dto.response.SurgeryResponse;
import br.com.easypet.business.service.SurgeryService;
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
@RequestMapping("/pets/{petId}/surgeries")
@RequiredArgsConstructor
@Tag(name = "Cirurgias", description = "Histórico de cirurgias dos pets")
public class SurgeryController {

    private final SurgeryService surgeryService;

    @PostMapping
    @Operation(summary = "Registrar uma nova cirurgia")
    public ResponseEntity<SurgeryResponse> create(@PathVariable UUID petId, @Valid @RequestBody SurgeryRequest request) {
        SurgeryResponse response = surgeryService.create(petId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar histórico de cirurgias (paginado)")
    public ResponseEntity<Page<SurgeryResponse>> findAll(@PathVariable UUID petId, @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(surgeryService.findAllByPet(petId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados de uma cirurgia")
    public ResponseEntity<SurgeryResponse> update(@PathVariable UUID petId, @PathVariable UUID id, @Valid @RequestBody SurgeryRequest request) {
        return ResponseEntity.ok(surgeryService.update(petId, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover registro de cirurgia")
    public ResponseEntity<Void> delete(@PathVariable UUID petId, @PathVariable UUID id) {
        surgeryService.delete(petId, id);
        return ResponseEntity.noContent().build();
    }
}
