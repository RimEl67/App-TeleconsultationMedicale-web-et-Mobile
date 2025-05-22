import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { MedicalRecord } from '../types';
import MedicalRecordsList from '../components/medical/MedicalRecordsList';
import { Search, Filter, Plus } from 'lucide-react';

const MedicalRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddRecordForm, setShowAddRecordForm] = useState(false);
  
  useEffect(() => {
    const fetchMedicalRecords = async () => {
      if (!user) return;
      
      try {
        // In a real app, this would be the current user's ID for patients
        // or would show records for a selected patient for doctors
        const data = await api.getMedicalRecords('p1');
        setRecords(data);
      } catch (error) {
        console.error('Error fetching medical records:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedicalRecords();
  }, [user]);
  
  const filteredRecords = records.filter((record) => 
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleAddRecord = () => {
    setShowAddRecordForm(true);
  };
  
  const handleCancelAddRecord = () => {
    setShowAddRecordForm(false);
  };
  
  const handleSaveRecord = async (formData: FormData) => {
    if (!user) return;
    
    try {
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const fileInput = formData.get('files') as File;
      
      // Create the new record
      const newMedicalRecord: MedicalRecord = {
        id: `record-${Date.now()}`,
        patientId: 'p1', // Or user.id if the user is a patient
        doctorId: user.role === 'doctor' ? user.id : 'd1',
        date: new Date().toISOString(),
        title: title,
        description: description,
        files: fileInput ? [{
          id: `file-${Date.now()}`,
          name: fileInput.name,
          type: fileInput.type.includes('image') ? 'image' : 'report',
          url: URL.createObjectURL(fileInput),
          uploadedAt: new Date().toISOString()
        }] : []
      };
      
      // For now, just add it to the local state
      setRecords(prev => [newMedicalRecord, ...prev]);
      setShowAddRecordForm(false);
    } catch (error) {
      console.error('Error adding medical record:', error);
    }
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Medical Records</h1>
        <p className="text-gray-600">View and manage your medical history</p>
      </div>
      
      <div className="mb-6 bg-white rounded-lg shadow-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medical records..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              <Filter size={18} />
              <span>Filter</span>
            </button>
            
            {user.role === 'doctor' && (
              <button 
                onClick={handleAddRecord}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={18} />
                <span>Add Record</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {!showAddRecordForm ? (
        loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <MedicalRecordsList records={filteredRecords} />
        )
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6">Add New Medical Record</h2>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleSaveRecord(formData);
          }}>
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Record Title*
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter record title"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter details about this record"
                ></textarea>
              </div>
              
              <div>
                <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Files
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    id="files"
                    name="files"
                    type="file"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Upload prescriptions, reports, or other medical documents
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancelAddRecord}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Record
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsPage;