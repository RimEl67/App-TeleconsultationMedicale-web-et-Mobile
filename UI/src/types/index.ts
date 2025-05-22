// Type definitions for the application

export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  specialtyId?: string; // For doctors only
  profileImage?: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date string
  time: string; // Format: "HH:MM"
  duration: number; // in minutes
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'in-person' | 'teleconsultation';
  notes?: string;
}

export interface TimeSlot {
  time: string; // Format: "HH:MM"
  available: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string; // ISO date string
  read: boolean;
  attachmentUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string; // ISO date string
  read: boolean;
  type: 'appointment' | 'message' | 'system';
  linkTo?: string; // URL to navigate to when clicked
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string; // ISO date string
  title: string;
  description: string;
  files: MedicalFile[];
}

export interface MedicalFile {
  id: string;
  name: string;
  type: 'prescription' | 'report' | 'image' | 'other';
  url: string;
  uploadedAt: string; // ISO date string
}