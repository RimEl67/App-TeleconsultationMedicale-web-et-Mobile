import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Check, Info, AlertCircle, Save } from 'lucide-react';

// Time slots from 9am to 5pm
const timeSlots = Array.from({ length: 17 }, (_, i) => {
  const hour = Math.floor((i + 18) / 2);
  const minute = (i + 18) % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

// Days of the week
const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface Availability {
  [day: string]: {
    available: boolean;
    slots: {
      [time: string]: boolean;
    };
  };
}

const MyAvailabilityPage: React.FC = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState<Availability>({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    // Simulating API call to get availability
    setTimeout(() => {
      // Initialize with some sample data
      const initialAvailability: Availability = {};
      
      daysOfWeek.forEach(day => {
        initialAvailability[day] = {
          available: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day),
          slots: {}
        };
        
        timeSlots.forEach(time => {
          // Make 9am-5pm available on weekdays by default
          initialAvailability[day].slots[time] = 
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day) &&
            time >= '09:00' && time <= '17:00';
        });
      });
      
      setAvailability(initialAvailability);
      setLoading(false);
    }, 1000);
  }, []);
  
  const toggleDayAvailability = (day: string) => {
    setAvailability(prev => {
      const newAvailability = { ...prev };
      newAvailability[day] = {
        ...newAvailability[day],
        available: !newAvailability[day].available
      };
      
      // If setting to unavailable, clear all time slots
      if (!newAvailability[day].available) {
        Object.keys(newAvailability[day].slots).forEach(time => {
          newAvailability[day].slots[time] = false;
        });
      }
      
      return newAvailability;
    });
  };
  
  const toggleTimeSlot = (day: string, time: string) => {
    setAvailability(prev => {
      const newAvailability = { ...prev };
      newAvailability[day] = {
        ...newAvailability[day],
        slots: {
          ...newAvailability[day].slots,
          [time]: !newAvailability[day].slots[time]
        }
      };
      return newAvailability;
    });
  };
  
  const saveAvailability = () => {
    // In a real app, send the availability to your API
    console.log('Saving availability:', availability);
    
    // Show success message
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  if (!user || user.role !== 'doctor') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle size={48} className="text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-gray-600">Only doctors can access this page.</p>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Availability</h1>
        <p className="text-gray-600">Set your available days and time slots for appointments</p>
      </div>
      
      {success && (
        <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <Check size={18} className="inline mr-2" />
          <span>Your availability has been saved successfully.</span>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-5 border-b">
          <div className="flex items-center">
            <Info size={18} className="text-blue-500 mr-2" />
            <p className="text-sm text-gray-600">
              Toggle a day to make it available or unavailable. For available days, select specific time slots when you can accept appointments.
            </p>
          </div>
        </div>
        
        <div className="p-5 space-y-6">
          {daysOfWeek.map(day => (
            <div key={day} className="border rounded-lg overflow-hidden">
              <div 
                className={`p-4 flex justify-between items-center cursor-pointer ${
                  availability[day].available ? 'bg-blue-50' : 'bg-gray-50'
                }`}
                onClick={() => toggleDayAvailability(day)}
              >
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2 text-blue-500" />
                  <span className="font-medium">{day}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="mr-2 text-sm">
                    {availability[day].available ? 'Available' : 'Unavailable'}
                  </span>
                  <button 
                    className={`w-10 h-5 rounded-full flex items-center transition-colors duration-300 focus:outline-none ${
                      availability[day].available ? 'bg-blue-500 justify-end' : 'bg-gray-300 justify-start'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full mx-0.5 transform transition-transform duration-300 ${
                      availability[day].available ? 'bg-white translate-x-0' : 'bg-white -translate-x-0'
                    }`}></span>
                  </button>
                </div>
              </div>
              
              {availability[day].available && (
                <div className="p-4 bg-white border-t">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Clock size={16} className="mr-1 text-blue-500" />
                    Time Slots
                  </h4>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        className={`py-1 px-2 text-xs rounded-md transition-colors ${
                          availability[day].slots[time]
                            ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => toggleTimeSlot(day, time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="pt-4 flex justify-end">
            <button
              onClick={saveAvailability}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              <Save size={18} className="mr-2" />
              Save Availability
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAvailabilityPage;