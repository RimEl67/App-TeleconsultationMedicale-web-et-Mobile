import React from 'react';
import { Appointment } from '../../types';
import { Calendar, Video, MapPin, Clock } from 'lucide-react';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
}

const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({ appointments }) => {
  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getAppointmentTypeIcon = (type: string) => {
    if (type === 'teleconsultation') {
      return <Video size={18} className="text-blue-500" />;
    } else {
      return <MapPin size={18} className="text-red-500" />;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-full">
      <div className="flex items-center mb-5">
        <Calendar size={20} className="text-blue-500 mr-2" />
        <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
      </div>
      
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment.id} className="border-l-4 border-blue-500 pl-4 py-2">
              <div className="flex items-center mb-2">
                <div className="mr-2">
                  {getAppointmentTypeIcon(appointment.type)}
                </div>
                <p className="font-medium">
                  {appointment.type === 'teleconsultation' ? 'Teleconsultation' : 'In-person visit'}
                </p>
              </div>
              
              <p className="text-gray-700 mb-2">
                {formatDate(appointment.date)}
              </p>
              
              <div className="flex items-center text-gray-600">
                <Clock size={16} className="mr-1" />
                <span>{appointment.time}</span>
                <span className="mx-1">•</span>
                <span>{appointment.duration} minutes</span>
              </div>
              
              {appointment.notes && (
                <p className="text-gray-600 mt-2 text-sm italic">
                  {appointment.notes}
                </p>
              )}
              
              <div className="mt-3 flex space-x-2">
                <button className="text-sm px-3 py-1 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors">
                  {appointment.type === 'teleconsultation' ? 'Join call' : 'View details'}
                </button>
                <button className="text-sm px-3 py-1 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
                  Reschedule
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No upcoming appointments</p>
            <button className="mt-2 text-blue-600 hover:text-blue-800">
              Book an appointment
            </button>
          </div>
        )}
      </div>
      
      {appointments.length > 0 && (
        <div className="mt-5 text-center">
          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View all appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default UpcomingAppointments;