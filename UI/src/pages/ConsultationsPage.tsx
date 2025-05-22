import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Appointment } from '../types';
import { Calendar, Clock, Video, User, FileText, Filter, Plus, Search } from 'lucide-react';

const ConsultationsPage: React.FC = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  useEffect(() => {
    const fetchConsultations = async () => {
      if (!user) return;
      
      try {
        // In a real app, this would use the current user's ID
        const data = await api.getAppointments(user.id, user.role);
        setConsultations(data);
      } catch (error) {
        console.error('Error fetching consultations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultations();
  }, [user]);
  
  const upcomingConsultations = consultations.filter(
    (consultation) => 
      consultation.status === 'scheduled' && 
      new Date(consultation.date) >= new Date()
  );
  
  const pastConsultations = consultations.filter(
    (consultation) => 
      consultation.status === 'completed' || 
      new Date(consultation.date) < new Date()
  );
  
  const filteredConsultations = activeTab === 'upcoming' 
    ? upcomingConsultations.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : pastConsultations.filter(c => 
        c.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleScheduleConsultation = () => {
    setShowScheduleForm(true);
  };
  
  const handleCancelScheduling = () => {
    setShowScheduleForm(false);
  };
  
  const handleSaveConsultation = async (formData: FormData) => {
    if (!user) return;
    
    try {
      const doctorId = formData.get('doctorId') as string;
      const date = formData.get('date') as string;
      const time = formData.get('time') as string;
      const durationType = formData.get('durationType') as string;
      const consultationType = formData.get('consultationType') as string;
      const notes = formData.get('notes') as string;
      
      let duration = 30; // default duration in minutes
      if (durationType === 'long') {
        duration = 60;
      }
      
      // Create the new consultation
      const newConsultation: Appointment = {
        id: `consultation-${Date.now()}`,
        patientId: user.role === 'patient' ? user.id : 'p1',
        doctorId: user.role === 'doctor' ? user.id : doctorId,
        date: new Date(date).toISOString(),
        time: time,
        duration: duration,
        status: 'scheduled',
        type: consultationType as 'in-person' | 'teleconsultation',
        notes: notes
      };
      
      // In a real app, you would call the API to save the consultation
      // await api.bookAppointment(newConsultation);
      
      // For now, just add it to the local state
      setConsultations(prev => [newConsultation, ...prev]);
      setShowScheduleForm(false);
    } catch (error) {
      console.error('Error scheduling consultation:', error);
    }
  };
  
  const handleJoinCall = (consultationId: string) => {
    // In a real app, this would redirect to the video call page or launch a video call component
    console.log(`Joining call for consultation: ${consultationId}`);
    alert('Joining video consultation...');
  };
  
  if (!user) {
    return null;
  }
  
  const isDoctor = user.role === 'doctor';
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Consultations</h1>
        <p className="text-gray-600">
          {isDoctor 
            ? 'Manage and conduct patient consultations' 
            : 'Schedule and attend medical consultations'}
        </p>
      </div>
      
      {!showScheduleForm ? (
        <>
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="border-b">
              <div className="flex">
                <button 
                  className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'upcoming' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('upcoming')}
                >
                  Upcoming
                </button>
                <button 
                  className={`px-6 py-4 font-medium text-sm focus:outline-none ${
                    activeTab === 'past' 
                      ? 'border-b-2 border-blue-600 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('past')}
                >
                  Past
                </button>
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search consultations..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                    <Filter size={18} />
                    <span>Filter</span>
                  </button>
                  
                  <button 
                    onClick={handleScheduleConsultation}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Schedule</span>
                  </button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredConsultations.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {activeTab === 'upcoming' ? 'No upcoming consultations' : 'No past consultations'}
                  </h3>
                  <p className="text-gray-500">
                    {activeTab === 'upcoming' 
                      ? 'Schedule a consultation to get started' 
                      : 'Your consultation history will appear here'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredConsultations.map((consultation) => (
                    <div 
                      key={consultation.id} 
                      className="border rounded-lg p-5 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                        <div>
                          <h3 className="font-medium">
                            {consultation.type === 'teleconsultation' ? 'Video Consultation' : 'In-Person Visit'}
                          </h3>
                          <div className="flex items-center text-gray-500 text-sm mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{formatDate(consultation.date)}</span>
                            <span className="mx-2">•</span>
                            <Clock size={14} className="mr-1" />
                            <span>{consultation.time}</span>
                            <span className="mx-2">•</span>
                            <span>{consultation.duration} min</span>
                          </div>
                        </div>
                        
                        {activeTab === 'upcoming' && consultation.type === 'teleconsultation' && (
                          <button
                            onClick={() => handleJoinCall(consultation.id)}
                            className="mt-3 md:mt-0 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
                          >
                            <Video size={16} />
                            <span>Join Call</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <User size={16} className="mr-2" />
                          <span>
                            {isDoctor ? 'Patient: John Doe' : 'Doctor: Dr. Sarah Johnson'}
                          </span>
                        </div>
                        
                        {consultation.notes && (
                          <div className="flex items-center text-gray-600">
                            <FileText size={16} className="mr-2" />
                            <span>{consultation.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Schedule Consultation</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSaveConsultation(formData);
          }}>
            <div className="space-y-6">
              {!isDoctor && (
                <div>
                  <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Doctor*
                  </label>
                  <select
                    id="doctorId"
                    name="doctorId"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a doctor</option>
                    <option value="d1">Dr. Sarah Johnson - Cardiologist</option>
                    <option value="d2">Dr. Michael Chen - Family Medicine</option>
                    <option value="d3">Dr. Emily Rodriguez - Dermatologist</option>
                  </select>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date*
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Time*
                  </label>
                  <select
                    id="time"
                    name="time"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a time</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="durationType" className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <select
                    id="durationType"
                    name="durationType"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard (30 min)</option>
                    <option value="long">Long (60 min)</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="consultationType" className="block text-sm font-medium text-gray-700 mb-1">
                    Consultation Type*
                  </label>
                  <select
                    id="consultationType"
                    name="consultationType"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select type</option>
                    <option value="teleconsultation">Video Consultation</option>
                    <option value="in-person">In-Person Visit</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your symptoms or reason for the consultation"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelScheduling}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Schedule Consultation
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ConsultationsPage;