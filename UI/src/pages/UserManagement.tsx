import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { 
  Search,  
  Check, 
  X, 
  Edit2, 
  Trash2, 
  UserPlus,
  
} from 'lucide-react';

interface UserManagementProps {
  users: User[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
  onEdit: (userId: string) => void;
  onDelete: (userId: string) => void;
}

interface AddUserFormData {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  specialtyId?: string;
}

const UserManagement: React.FC<UserManagementProps> = ({ 
  users, 
  onApprove, 
  onEdit, 
  onDelete 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [formData, setFormData] = useState<AddUserFormData>({
    firstName: '',
    lastName: '',
    email: '',
    role: 'patient',
    password: '',
    confirmPassword: '',
    specialtyId: ''
  });
  
  // List of specialties
  const specialties = [
    { id: 's1', name: 'Cardiology' },
    { id: 's2', name: 'Dermatology' },
    { id: 's3', name: 'Family Medicine' },
    { id: 's4', name: 'Neurology' },
    { id: 's5', name: 'Pediatrics' }
  ];
  
  // Handle user filtering based on search and role
  useEffect(() => {
    let result = [...users];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.firstName.toLowerCase().includes(query) || 
          user.lastName.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
      );
    }
    
    if (roleFilter) {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchQuery, roleFilter]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'patient',
      password: '',
      confirmPassword: '',
      specialtyId: ''
    });
  };
  
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setShowAddModal(false);
    resetForm();
    // In a real app, you would call an API to add the user
  };
  
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: '',
      specialtyId: user.specialtyId
    });
    setShowEditModal(true);
  };
  
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUser) {
      console.log('Edit user:', selectedUser.id, formData);
      onEdit(selectedUser.id);
    }
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };
  
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser.id);
      setShowDeleteConfirm(false);
      setSelectedUser(null);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold">User Management</h2>
          <p className="text-sm text-gray-500">Manage system users and permissions</p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-3 sm:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
        >
          <UserPlus size={18} className="mr-2" />
          Add User
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between mb-4 space-y-3 md:space-y-0 md:space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        
        <div>
          <select
            value={roleFilter}
            onChange={handleRoleFilterChange}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md appearance-none"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 
                        user.role === 'doctor' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => onApprove(user.id)}
                        className="text-green-600 hover:text-green-900"
                        title="Approve user"
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleEditClick(user)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit user"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-center text-sm text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Add New User</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {formData.role === 'doctor' && (
                  <div>
                    <label htmlFor="specialtyId" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select
                      id="specialtyId"
                      name="specialtyId"
                      value={formData.specialtyId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a specialty</option>
                      {specialties.map(specialty => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Edit User</h3>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="edit-firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="edit-lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="edit-email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="edit-role" className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    id="edit-role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {formData.role === 'doctor' && (
                  <div>
                    <label htmlFor="edit-specialtyId" className="block text-sm font-medium text-gray-700 mb-1">
                      Specialty
                    </label>
                    <select
                      id="edit-specialtyId"
                      name="specialtyId"
                      value={formData.specialtyId}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Select a specialty</option>
                      {specialties.map(specialty => (
                        <option key={specialty.id} value={specialty.id}>
                          {specialty.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="edit-password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password (optional)
                    </label>
                    <input
                      type="password"
                      id="edit-password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="edit-confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="edit-confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Update User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Delete User</h3>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete <span className="font-semibold">{selectedUser.firstName} {selectedUser.lastName}</span>? This action cannot be undone.
              </p>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;