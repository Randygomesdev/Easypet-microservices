package br.com.easypet.business.controller;

import br.com.easypet.business.dto.request.WeightRecordRequest;
import br.com.easypet.business.dto.response.WeightRecordResponse;
import br.com.easypet.business.service.WeightRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.UUID;

@RestController
@RequestMapping("/pets/{petId}/weights")
@RequiredArgsConstructor
@Tag(name = "Pesos", description = "Histórico de pesagem dos pets")
public class WeightController {

    private final WeightRecordService weightRecordService;

    @PostMapping
    @Operation(summary = "Registrar novo peso")
    public ResponseEntity<WeightRecordResponse> create(@PathVariable UUID petId, @Valid @RequestBody WeightRecordRequest request) {
        WeightRecordResponse response = weightRecordService.create(petId, request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @GetMapping
    @Operation(summary = "Listar histórico de pesos dos pets (Paginado)")
    public ResponseEntity<Page<WeightRecordResponse>> findAll(@PathVariable UUID petId, Pageable pageable) {
        return ResponseEntity.ok(weightRecordService.findAllByPet(petId, pageable));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Excluir registro de peso dos pets")
    public ResponseEntity<Void> delete(@PathVariable UUID petId, @RequestParam UUID id) {
        weightRecordService.delete(petId, id);
        return ResponseEntity.noContent().build();
    }
}
