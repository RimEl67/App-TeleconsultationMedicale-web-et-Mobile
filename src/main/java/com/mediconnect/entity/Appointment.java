package com.mediconnect.entity;

import com.mediconnect.entity.enums.AppointmentStatus;
import com.mediconnect.entity.enums.AppointmentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Appointment {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User patient;

    @ManyToOne
    private User doctor;

    private LocalDateTime dateTime;

    private int durationInMinutes;

    @Enumerated(EnumType.STRING)
    private AppointmentType type;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    private String notes;
}
