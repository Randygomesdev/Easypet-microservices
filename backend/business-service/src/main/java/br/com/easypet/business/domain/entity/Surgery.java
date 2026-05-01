package br.com.easypet.business.domain.entity;

import br.com.easypet.business.domain.model.AppointmentStatus; // Podemos reaproveitar o enum
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "surgeries")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Surgery {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime date;

    private String vetName;
    private UUID providerId;

    private String anesthesiaType;

    @Column(length = 2000)
    private String postOperativeInstructions;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private Boolean certified;
}
