import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Appointment, Message } from '../types';
import DashboardStats from '../components/dashboard/DashboardStats';
import UpcomingAppointments from '../components/dashboard/UpcomingAppointments';
import RecentMessages from '../components/dashboard/RecentMessages';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      try {
        const [appointmentsData, messagesData] = await Promise.all([
          api.getAppointments(user.id, user.role),
          api.getMessages(user.id)
        ]);
        
        setAppointments(appointmentsData.filter(a => a.status === 'scheduled'));
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);
  
  if (!user) {
    return null;
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        Welcome, {user.role === 'doctor' ? 'Dr. ' : ''}{user.firstName}
      </h1>
      
      <DashboardStats role={user.role} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingAppointments appointments={appointments} />
        <RecentMessages messages={messages} />
      </div>
      
      {user.role === 'patient' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              Book an Appointment
            </button>
            <button className="p-4 text-center bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors">
              Start Teleconsultation
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
              View Medical Records
            </button>
          </div>
        </div>
      )}
      
      {user.role === 'doctor' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Doctor Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              Manage Schedule
            </button>
            <button className="p-4 text-center bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors">
              View Patient List
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
              Create Medical Report
            </button>
          </div>
        </div>
      )}
      
      {user.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-sm p-5">
          <h2 className="text-lg font-semibold mb-4">Administration</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              User Management
            </button>
            <button className="p-4 text-center bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors">
              System Settings
            </button>
            <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors">
              View Analytics
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;