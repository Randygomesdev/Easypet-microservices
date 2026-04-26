package br.com.easypet.business.controller;

import br.com.easypet.business.dto.request.PetRequest;
import br.com.easypet.business.dto.response.PetResponse;
import br.com.easypet.business.service.PetService;
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
@RequestMapping("/pets")
@RequiredArgsConstructor
@Tag(name = "Pets", description = "Gerenciamento de pets dos usuários")
public class PetController {

    private final PetService petService;


    @PostMapping
    @Operation(summary = "Cadastrar um novo pet")
    public ResponseEntity<PetResponse> create(@Valid @RequestBody PetRequest request) {
        PetResponse response = petService.create(request);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();
        return ResponseEntity.created(uri).body(response);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza as informações do Pet selecionado")
    public ResponseEntity<PetResponse> update(@PathVariable UUID id, @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(petService.update(id, request));
    }

    @GetMapping
    @Operation(summary = "Listar todos os pets do usuário logado")
    public ResponseEntity<Page<PetResponse>> findAll(@ParameterObject Pageable pageable) {
        return ResponseEntity.ok(petService.findAllByOwner(pageable));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar pet para o usuário logado")
    public ResponseEntity<Void> delete(@PathVariable UUID id){
        petService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

