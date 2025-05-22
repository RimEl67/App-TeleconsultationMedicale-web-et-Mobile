// Mock API service for demonstration
// In a real application, this would connect to your backend

import { User, Appointment, Message, Notification, MedicalRecord, Specialty, TimeSlot } from '../types';

// Simulated API response delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class Api {
  // Authentication
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await delay(1000);
    
    // Mock response - in a real app, this would call your backend
    if (email === 'doctor@example.com' && password === 'password') {
      return {
        token: 'mock-jwt-token-for-doctor',
        user: {
          id: 'd1',
          email: 'doctor@example.com',
          firstName: 'John',
          lastName: 'Smith',
          role: 'doctor',
          specialtyId: 's1',
          profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      };
    } 
    
    if (email === 'patient@example.com' && password === 'password') {
      return {
        token: 'mock-jwt-token-for-patient',
        user: {
          id: 'p1',
          email: 'patient@example.com',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'patient',
          profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      };
    }
    
    if (email === 'admin@example.com' && password === 'password') {
      return {
        token: 'mock-jwt-token-for-admin',
        user: {
          id: 'a1',
          email: 'admin@example.com',
          firstName: 'Admin',
          lastName: 'User',
          role: 'admin',
          profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
      };
    }
    
    throw new Error('Invalid credentials');
  }

  async register(userData: Partial<User>, password: string): Promise<{ token: string; user: User }> {
    await delay(1000);
    
    // Mock registration response
    const user: User = {
      id: `u${Math.floor(Math.random() * 1000)}`,
      email: userData.email || '',
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      role: userData.role || 'patient',
      profileImage: userData.profileImage
    };
    
    return {
      token: 'mock-jwt-token-for-new-user',
      user
    };
  }

  async getCurrentUser(): Promise<User> {
    await delay(500);
    
    // This would normally validate a token and return user data
    // For demo, we'll return a dummy user based on stored role
    const token = localStorage.getItem('token');
    
    if (token?.includes('doctor')) {
      return {
        id: 'd1',
        email: 'doctor@example.com',
        firstName: 'John',
        lastName: 'Smith',
        role: 'doctor',
        specialtyId: 's1',
        profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      };
    } 
    
    if (token?.includes('patient')) {
      return {
        id: 'p1',
        email: 'patient@example.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'patient',
        profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      };
    }
    
    if (token?.includes('admin')) {
      return {
        id: 'a1',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      };
    }
    
    throw new Error('Not authenticated');
  }

  // Specialties
  async getSpecialties(): Promise<Specialty[]> {
    await delay(500);
    return [
      { id: 's1', name: 'Cardiology', description: 'Heart and cardiovascular system', icon: 'heart' },
      { id: 's2', name: 'Dermatology', description: 'Skin, hair, and nails', icon: 'user' },
      { id: 's3', name: 'Neurology', description: 'Brain and nervous system', icon: 'brain' },
      { id: 's4', name: 'Pediatrics', description: 'Children\'s health', icon: 'baby' },
      { id: 's5', name: 'Orthopedics', description: 'Bones and muscles', icon: 'bone' },
      { id: 's6', name: 'Ophthalmology', description: 'Eye care', icon: 'eye' }
    ];
  }

  // Doctors
  async getDoctorsBySpecialty(specialtyId: string): Promise<User[]> {
    await delay(500);
    return [
      { 
        id: 'd1', 
        email: 'doctor@example.com', 
        firstName: 'John', 
        lastName: 'Smith', 
        role: 'doctor', 
        specialtyId: 's1',
        profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
      },
      { 
        id: 'd2', 
        email: 'doctor2@example.com', 
        firstName: 'Sarah', 
        lastName: 'Johnson', 
        role: 'doctor', 
        specialtyId: 's1',
        profileImage: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' 
      },
    ];
  }

  // Availability
  async getDoctorAvailability(doctorId: string, date: string): Promise<TimeSlot[]> {
    await delay(500);
    
    // Mock time slots
    return [
      { time: '09:00', available: true },
      { time: '09:30', available: true },
      { time: '10:00', available: false },
      { time: '10:30', available: true },
      { time: '11:00', available: true },
      { time: '11:30', available: false },
      { time: '13:00', available: true },
      { time: '13:30', available: true },
      { time: '14:00', available: true },
      { time: '14:30', available: false },
      { time: '15:00', available: true },
      { time: '15:30', available: true },
      { time: '16:00', available: true },
    ];
  }

  // Appointments
  async getAppointments(userId: string, role: string): Promise<Appointment[]> {
    await delay(500);
    
    // Return appointments based on user role
    const appointments: Appointment[] = [
      {
        id: 'a1',
        patientId: 'p1',
        doctorId: 'd1',
        date: '2025-06-15',
        time: '09:00',
        duration: 30,
        status: 'scheduled',
        type: 'teleconsultation'
      },
      {
        id: 'a2',
        patientId: 'p1',
        doctorId: 'd2',
        date: '2025-06-18',
        time: '14:30',
        duration: 45,
        status: 'scheduled',
        type: 'in-person',
        notes: 'Follow-up appointment'
      },
      {
        id: 'a3',
        patientId: 'p2',
        doctorId: 'd1',
        date: '2025-06-10',
        time: '11:00',
        duration: 30,
        status: 'completed',
        type: 'teleconsultation'
      }
    ];
    
    if (role === 'patient') {
      return appointments.filter(a => a.patientId === userId);
    } else if (role === 'doctor') {
      return appointments.filter(a => a.doctorId === userId);
    } else {
      return appointments;
    }
  }

  async bookAppointment(appointment: Partial<Appointment>): Promise<Appointment> {
    await delay(1000);
    
    // Mock response - in a real app, this would save to your backend
    return {
      id: `a${Math.floor(Math.random() * 1000)}`,
      patientId: appointment.patientId || '',
      doctorId: appointment.doctorId || '',
      date: appointment.date || '',
      time: appointment.time || '',
      duration: appointment.duration || 30,
      status: 'scheduled',
      type: appointment.type || 'in-person',
      notes: appointment.notes
    };
  }

  // Messages
  async getMessages(userId: string): Promise<Message[]> {
    await delay(500);
    
    return [
      {
        id: 'm1',
        senderId: 'd1',
        receiverId: 'p1',
        content: 'Hello, how can I help you today?',
        timestamp: '2025-06-14T10:30:00Z',
        read: true
      },
      {
        id: 'm2',
        senderId: 'p1',
        receiverId: 'd1',
        content: 'I have a question about my prescription.',
        timestamp: '2025-06-14T10:32:00Z',
        read: true
      },
      {
        id: 'm3',
        senderId: 'd1',
        receiverId: 'p1',
        content: 'Sure, what would you like to know?',
        timestamp: '2025-06-14T10:35:00Z',
        read: false
      }
    ];
  }

  async sendMessage(message: Partial<Message>): Promise<Message> {
    await delay(500);
    
    return {
      id: `m${Math.floor(Math.random() * 1000)}`,
      senderId: message.senderId || '',
      receiverId: message.receiverId || '',
      content: message.content || '',
      timestamp: new Date().toISOString(),
      read: false,
      attachmentUrl: message.attachmentUrl
    };
  }

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(500);
    
    return [
      {
        id: 'n1',
        userId,
        title: 'Appointment Reminder',
        message: 'You have an appointment tomorrow at 9:00 AM',
        timestamp: '2025-06-14T08:00:00Z',
        read: false,
        type: 'appointment',
        linkTo: '/appointments'
      },
      {
        id: 'n2',
        userId,
        title: 'New Message',
        message: 'You have a new message from Dr. Smith',
        timestamp: '2025-06-13T15:30:00Z',
        read: true,
        type: 'message',
        linkTo: '/messages'
      }
    ];
  }

  // Medical Records
  async getMedicalRecords(patientId: string): Promise<MedicalRecord[]> {
    await delay(500);
    
    return [
      {
        id: 'mr1',
        patientId,
        doctorId: 'd1',
        date: '2025-05-20',
        title: 'Annual Checkup',
        description: 'General health examination with blood tests',
        files: [
          {
            id: 'f1',
            name: 'Blood Test Results',
            type: 'report',
            url: '#',
            uploadedAt: '2025-05-20T14:30:00Z'
          },
          {
            id: 'f2',
            name: 'Prescription',
            type: 'prescription',
            url: '#',
            uploadedAt: '2025-05-20T14:35:00Z'
          }
        ]
      },
      {
        id: 'mr2',
        patientId,
        doctorId: 'd2',
        date: '2025-04-15',
        title: 'Allergy Consultation',
        description: 'Evaluation for seasonal allergies',
        files: [
          {
            id: 'f3',
            name: 'Allergy Test Results',
            type: 'report',
            url: '#',
            uploadedAt: '2025-04-15T11:00:00Z'
          }
        ]
      }
    ];
  }
}

export const api = new Api();