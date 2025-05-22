import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Appointment } from '../types';
import AppointmentBooking from '../components/appointments/AppointmentBooking';
import { Calendar, Check, X, Video, MapPin } from 'lucide-react';

const AppointmentPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'book'>('upcoming');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;
      
      try {
        const data = await api.getAppointments(user.id, user.role);
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [user]);
  
  const upcomingAppointments = appointments.filter(a => a.status === 'scheduled');
  const pastAppointments = appointments.filter(a => a.status === 'completed' || a.status === 'cancelled');
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <p className="text-gray-600">Manage your medical appointments</p>
      </div>
      
      <div className="flex border-b mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'upcoming'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'past'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past
        </button>
        <button
          onClick={() => setActiveTab('book')}
          className={`px-4 py-2 font-medium text-sm ${
            activeTab === 'book'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Book Appointment
        </button>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {activeTab === 'upcoming' && (
            <div className="space-y-4">
              {upcomingAppointments.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No upcoming appointments</h3>
                  <p className="text-gray-500 mb-4">You don't have any scheduled appointments.</p>
                  <button
                    onClick={() => setActiveTab('book')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Book an Appointment
                  </button>
                </div>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="mr-2">
                            {appointment.type === 'teleconsultation' 
                              ? <Video size={20} className="text-blue-500" /> 
                              : <MapPin size={20} className="text-red-500" />
                            }
                          </div>
                          <h3 className="font-medium">
                            {appointment.type === 'teleconsultation' 
                              ? 'Teleconsultation' 
                              : 'In-person visit'
                            }
                          </h3>
                        </div>
                        
                        <p className="text-gray-700 mb-1">
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-600">
                          {appointment.time}, {appointment.duration} minutes
                        </p>
                        
                        {appointment.notes && (
                          <p className="mt-3 text-gray-600 text-sm italic">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {appointment.type === 'teleconsultation' && (
                          <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                            Join Call
                          </button>
                        )}
                        <button className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'past' && (
            <div className="space-y-4">
              {pastAppointments.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <Calendar size={40} className="mx-auto mb-3 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-800 mb-1">No past appointments</h3>
                  <p className="text-gray-500">You don't have any past appointments.</p>
                </div>
              ) : (
                pastAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-white p-5 rounded-lg shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center mb-2">
                          <div className="mr-2">
                            {appointment.status === 'completed'
                              ? <Check size={18} className="text-green-500" />
                              : <X size={18} className="text-red-500" />
                            }
                          </div>
                          <h3 className="font-medium capitalize">
                            {appointment.status}
                          </h3>
                        </div>
                        
                        <p className="text-gray-700 mb-1">
                          {formatDate(appointment.date)}
                        </p>
                        <p className="text-gray-600">
                          {appointment.time}, {appointment.duration} minutes
                        </p>
                        
                        <div className="mt-2 flex items-center text-gray-500">
                          {appointment.type === 'teleconsultation'
                            ? <Video size={16} className="mr-1" />
                            : <MapPin size={16} className="mr-1" />
                          }
                          <span className="text-sm capitalize">
                            {appointment.type}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <button className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'book' && (
            <AppointmentBooking />
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentPage;