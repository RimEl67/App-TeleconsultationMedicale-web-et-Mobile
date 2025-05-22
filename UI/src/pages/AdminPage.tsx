import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import UserManagement from '../components/user/UserManagement';

const mockUsers: User[] = [
  {
    id: 'd1',
    email: 'doctor@example.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'doctor',
    specialtyId: 's1',
    profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'p1',
    email: 'patient@example.com',
    firstName: 'Jane',
    lastName: 'Doe',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'a1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    profileImage: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'd2',
    email: 'doctor2@example.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'doctor',
    specialtyId: 's2',
    profileImage: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    id: 'p2',
    email: 'patient2@example.com',
    firstName: 'Robert',
    lastName: 'Wilson',
    role: 'patient',
    profileImage: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }
  
  const handleApprove = (userId: string) => {
    // In a real app, this would call an API to update the user's status
    console.log(`Approved user: ${userId}`);
  };
  
  const handleReject = (userId: string) => {
    // In a real app, this would call an API to reject the user
    console.log(`Rejected user: ${userId}`);
  };
  
  const handleEdit = (userId: string) => {
    // In a real app, this would open a form to edit the user
    console.log(`Edit user: ${userId}`);
  };
  
  const handleDelete = (userId: string) => {
    // In a real app, this would call an API to delete the user
    console.log(`Delete user: ${userId}`);
    setUsers(users.filter(u => u.id !== userId));
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Administration</h1>
        <p className="text-gray-600">Manage users and system settings</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <UserManagement
          users={users}
          onApprove={handleApprove}
          onReject={handleReject}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AdminPage;