package br.com.easypet.business.controller;

import br.com.easypet.business.dto.request.VaccineRequest;
import br.com.easypet.business.dto.response.VaccineResponse;
import br.com.easypet.business.service.VaccineService;
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
@RequestMapping("/pets/{petId}/vaccinations")
@RequiredArgsConstructor
@Tag(name = "Vacinas", description = "Histórico de vacinação dos pets")
public class VaccineController {

    private final VaccineService vaccineService;

    @PostMapping
    @Operation(summary = "Registrar nova vacina para o pet")
    public ResponseEntity<VaccineResponse> create(@PathVariable UUID petId, @Valid @RequestBody VaccineRequest request) {
        VaccineResponse response = vaccineService.create(petId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar histórico de vacinas do pet (paginado)")
    public ResponseEntity<Page<VaccineResponse>> findAll(@PathVariable UUID petId, @ParameterObject Pageable pageable) {
        return ResponseEntity.ok(vaccineService.findAllByPet(petId, pageable));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar dados de uma vacina")
    public ResponseEntity<VaccineResponse> update(@PathVariable UUID petId,@PathVariable UUID id, @Valid @RequestBody VaccineRequest request) {
        return ResponseEntity.ok(vaccineService.update(petId, id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir registro de vacina")
    public ResponseEntity<Void> delete(@PathVariable UUID petId, @PathVariable UUID id) {
        vaccineService.delete(petId, id);
        return ResponseEntity.noContent().build();
    }
}
