import React from 'react';
import { Calendar, MessageSquare, Clock, Users } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  role: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ role }) => {
  // Different stats based on user role
  if (role === 'patient') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Upcoming Appointments"
          value={2}
          icon={<Calendar size={20} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Unread Messages"
          value={3}
          icon={<MessageSquare size={20} className="text-white" />}
          color="bg-teal-500"
        />
        <StatCard
          title="Prescriptions"
          value={5}
          icon={<Clock size={20} className="text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Medical Records"
          value={8}
          icon={<Users size={20} className="text-white" />}
          color="bg-purple-500"
        />
      </div>
    );
  }
  
  if (role === 'doctor') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Today's Appointments"
          value={5}
          icon={<Calendar size={20} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Unread Messages"
          value={7}
          icon={<MessageSquare size={20} className="text-white" />}
          color="bg-teal-500"
        />
        <StatCard
          title="Pending Reports"
          value={3}
          icon={<Clock size={20} className="text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Total Patients"
          value={42}
          icon={<Users size={20} className="text-white" />}
          color="bg-purple-500"
        />
      </div>
    );
  }
  
  if (role === 'admin') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Users"
          value={158}
          icon={<Users size={20} className="text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Doctors"
          value={24}
          icon={<Users size={20} className="text-white" />}
          color="bg-teal-500"
        />
        <StatCard
          title="Appointments Today"
          value={37}
          icon={<Calendar size={20} className="text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Pending Approvals"
          value={5}
          icon={<Clock size={20} className="text-white" />}
          color="bg-purple-500"
        />
      </div>
    );
  }
  
  return null;
};

export default DashboardStats;