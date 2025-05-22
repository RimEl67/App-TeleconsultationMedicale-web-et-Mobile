import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  User, 
  Users, 
  Settings, 
  Home,
  Activity,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const { user } = useAuth();
  
  const navItems: NavItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: <Home size={20} />,
      roles: ['patient', 'doctor', 'admin']
    },
    {
      path: '/appointments',
      label: 'Appointments',
      icon: <Calendar size={20} />,
      roles: ['patient', 'doctor', 'admin']
    },
    {
      path: '/messages',
      label: 'Messages',
      icon: <MessageSquare size={20} />,
      roles: ['patient', 'doctor']
    },
    {
      path: '/medical-records',
      label: 'Medical Records',
      icon: <FileText size={20} />,
      roles: ['patient', 'doctor']
    },
    {
      path: '/consultations',
      label: 'Consultations',
      icon: <Activity size={20} />,
      roles: ['doctor']
    },
    {
      path: '/availability',
      label: 'My Availability',
      icon: <Clock size={20} />,
      roles: ['doctor']
    },
    {
      path: '/users',
      label: 'User Management',
      icon: <Users size={20} />,
      roles: ['admin']
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={20} />,
      roles: ['patient', 'doctor', 'admin']
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: <Settings size={20} />,
      roles: ['patient', 'doctor', 'admin']
    }
  ];
  
  // Filter nav items based on user role
  const filteredNavItems = user
    ? navItems.filter(item => item.roles.includes(user.role))
    : [];
  
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 pt-16
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-4 py-6">
          {user && (
            <div className="mb-8 text-center">
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-xl font-medium">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </span>
                </div>
              )}
              <h3 className="text-lg font-medium text-gray-800">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-sm text-gray-500 capitalize">
                {user.role}
              </p>
            </div>
          )}
          
          <nav>
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={closeSidebar}
                    className={({ isActive }) => `
                      flex items-center px-4 py-3 text-gray-700 rounded-lg
                      ${isActive 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'hover:bg-gray-50 transition-colors'
                      }
                    `}
                  >
                    <span className="mr-3 text-blue-600">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;