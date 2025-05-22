package com.mediconnect.repository;

import com.mediconnect.entity.Appointment;
import com.mediconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(User doctor);
}
