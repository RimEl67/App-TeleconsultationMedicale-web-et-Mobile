import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import { User as UserIcon, Mail, Phone, Building, Calendar, Award, Save, Camera } from 'lucide-react';

// Extended interface for profile data with additional fields
interface ProfileData extends Partial<User> {
  phone?: string;
  address?: string;
  birthDate?: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        specialtyId: user.specialtyId,
        // Additional fields not in User type
        phone: '555-123-4567',
        address: '123 Medical Center Dr, Health City',
        birthDate: '1980-01-01',
      });
      
      setProfileImage(user.profileImage || null);
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send the updated profile to your API
    console.log('Updated profile:', profileData);
    console.log('Updated image:', profileImage);
    
    // For now, just toggle editing mode off
    setEditing(false);
  };
  
  const specialties = [
    { id: 's1', name: 'Cardiology' },
    { id: 's2', name: 'Dermatology' },
    { id: 's3', name: 'Family Medicine' },
    { id: 's4', name: 'Neurology' },
    { id: 's5', name: 'Pediatrics' }
  ];
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-600">View and manage your personal information</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 mb-6 md:mb-0 flex flex-col items-center justify-start">
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={`${profileData.firstName} ${profileData.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-medium">
                  {profileData.firstName?.charAt(0)}
                  {profileData.lastName?.charAt(0)}
                </div>
              )}
              
              {editing && (
                <div className="absolute bottom-0 right-0">
                  <label htmlFor="profile-image" className="cursor-pointer bg-white rounded-full p-2 shadow-md">
                    <Camera size={20} className="text-blue-600" />
                    <input 
                      type="file" 
                      id="profile-image" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              )}
            </div>
            
            <div className="mt-4 text-center">
              <h2 className="text-xl font-semibold">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-500 capitalize">{profileData.role}</p>
              
              {profileData.role === 'doctor' && profileData.specialtyId && (
                <p className="text-blue-600 mt-1">
                  {specialties.find(s => s.id === profileData.specialtyId)?.name || 'Doctor'}
                </p>
              )}
            </div>
          </div>
          
          <div className="md:w-2/3 md:pl-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Personal Information</h3>
              
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileData.firstName || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <UserIcon size={18} className="text-gray-400 mr-2" />
                        <span>{profileData.firstName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileData.lastName || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <UserIcon size={18} className="text-gray-400 mr-2" />
                        <span>{profileData.lastName}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <Mail size={18} className="text-gray-400 mr-2" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <Phone size={18} className="text-gray-400 mr-2" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <Building size={18} className="text-gray-400 mr-2" />
                      <span>{profileData.address}</span>
                    </div>
                  )}
                </div>
                
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  {editing ? (
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={profileData.birthDate || ''}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <div className="flex items-center p-2 bg-gray-50 rounded-md">
                      <Calendar size={18} className="text-gray-400 mr-2" />
                      <span>{new Date(profileData.birthDate || '').toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {user.role === 'doctor' && (
                  <div>
                    <label htmlFor="specialtyId" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    {editing ? (
                      <select
                        id="specialtyId"
                        name="specialtyId"
                        value={profileData.specialtyId || ''}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      >
                        <option value="">Select a specialty</option>
                        {specialties.map(specialty => (
                          <option key={specialty.id} value={specialty.id}>
                            {specialty.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="flex items-center p-2 bg-gray-50 rounded-md">
                        <Award size={18} className="text-gray-400 mr-2" />
                        <span>
                          {specialties.find(s => s.id === profileData.specialtyId)?.name || 'Not specified'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {editing && (
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Save size={18} className="mr-2" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;