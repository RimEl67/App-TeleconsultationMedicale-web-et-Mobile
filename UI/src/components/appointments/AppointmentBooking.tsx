import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Specialty, TimeSlot, User } from '../../types';
import { Calendar, Clock, User as UserIcon, Search } from 'lucide-react';

const AppointmentBooking: React.FC = () => {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('');
  const [doctors, setDoctors] = useState<User[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'in-person' | 'teleconsultation'>('in-person');
  const [notes, setNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Format date to string
  const formatDateForInput = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Load specialties
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const data = await api.getSpecialties();
        setSpecialties(data);
      } catch (error) {
        console.error('Error fetching specialties:', error);
      }
    };
    
    fetchSpecialties();
  }, []);
  
  // Load doctors when specialty is selected
  useEffect(() => {
    if (selectedSpecialty) {
      const fetchDoctors = async () => {
        try {
          const data = await api.getDoctorsBySpecialty(selectedSpecialty);
          setDoctors(data);
        } catch (error) {
          console.error('Error fetching doctors:', error);
        }
      };
      
      fetchDoctors();
    } else {
      setDoctors([]);
    }
    setSelectedDoctor('');
  }, [selectedSpecialty]);
  
  // Load time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchTimeSlots = async () => {
        try {
          const data = await api.getDoctorAvailability(selectedDoctor, selectedDate);
          setTimeSlots(data);
        } catch (error) {
          console.error('Error fetching time slots:', error);
        }
      };
      
      fetchTimeSlots();
    } else {
      setTimeSlots([]);
    }
    setSelectedTime('');
  }, [selectedDoctor, selectedDate]);
  
  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpecialty(e.target.value);
  };
  
  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDoctor(e.target.value);
  };
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };
  
  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      return;
    }
    
    setLoading(true);
    
    try {
      await api.bookAppointment({
        doctorId: selectedDoctor,
        patientId: 'p1', // In a real app, this would be the current user's ID
        date: selectedDate,
        time: selectedTime,
        duration: 30,
        type: appointmentType,
        notes: notes
      });
      
      setSuccess(true);
      // Reset the form
      setSelectedSpecialty('');
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedTime('');
      setAppointmentType('in-person');
      setNotes('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Book an Appointment</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md">
          Appointment booked successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Step 1: Select Specialty */}
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <Search size={16} className="mr-1 text-blue-500" />
                Medical Specialty
              </span>
            </label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={handleSpecialtyChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a specialty</option>
              {specialties.map((specialty) => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Step 2: Select Doctor */}
          <div>
            <label htmlFor="doctor" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <UserIcon size={16} className="mr-1 text-blue-500" />
                Doctor
              </span>
            </label>
            <select
              id="doctor"
              value={selectedDoctor}
              onChange={handleDoctorChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedSpecialty}
              required
            >
              <option value="">Select a doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
          
          {/* Step 3: Select Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <Calendar size={16} className="mr-1 text-blue-500" />
                Date
              </span>
            </label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={handleDateChange}
              min={formatDateForInput()}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedDoctor}
              required
            />
          </div>
          
          {/* Step 4: Select Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Type</label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="in-person"
                  checked={appointmentType === 'in-person'}
                  onChange={() => setAppointmentType('in-person')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">In-person</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="teleconsultation"
                  checked={appointmentType === 'teleconsultation'}
                  onChange={() => setAppointmentType('teleconsultation')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-2 text-gray-700">Teleconsultation</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Step 5: Select Time */}
        {timeSlots.length > 0 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <span className="flex items-center">
                <Clock size={16} className="mr-1 text-blue-500" />
                Available Time Slots
              </span>
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => handleTimeChange(slot.time)}
                  disabled={!slot.available}
                  className={`
                    p-2 text-center rounded-md transition-colors
                    ${!slot.available 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : selectedTime === slot.time
                        ? 'bg-blue-500 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }
                  `}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Step 6: Notes */}
        <div className="mb-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add any specific details about your visit"
          ></textarea>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={!selectedDoctor || !selectedDate || !selectedTime || loading}
            className={`
              w-full py-2 px-4 rounded-md text-white font-medium
              ${(!selectedDoctor || !selectedDate || !selectedTime || loading)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
              }
            `}
          >
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;