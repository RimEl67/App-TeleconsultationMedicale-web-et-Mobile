import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, MessageSquare, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  return (
    <nav className="bg-white shadow-sm h-16 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-gray-700" />
          </button>
          
          <div className="flex items-center" onClick={() => navigate('/')} role="button">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
              Sahti
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          {user && (
            <>
              <button
                className="p-2 rounded-full relative hover:bg-gray-100"
                onClick={() => navigate('/notifications')}
              >
                <Bell size={20} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              <button
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={() => navigate('/messages')}
              >
                <MessageSquare size={20} className="text-gray-700" />
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-1 p-1 rounded-full hover:bg-gray-100">
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {user.firstName?.charAt(0)}
                        {user.lastName?.charAt(0)}
                      </span>
                    </div>
                  )}
                  <span className="hidden sm:block text-sm font-medium text-gray-700">
                    {user.firstName}
                  </span>
                </button>
                
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <a 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User size={16} className="mr-2" />
                    Profile
                  </a>
                  <button 
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;