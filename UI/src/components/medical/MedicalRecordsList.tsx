import React from 'react';
import { MedicalRecord } from '../../types';
import { FileText, Download, Eye, Calendar } from 'lucide-react';

interface MedicalRecordsListProps {
  records: MedicalRecord[];
}

const MedicalRecordsList: React.FC<MedicalRecordsListProps> = ({ records }) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-5 border-b">
        <h2 className="text-lg font-semibold">Medical Records</h2>
        <p className="text-gray-500 text-sm">Access and review your medical history</p>
      </div>
      
      {records.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <FileText size={40} className="mx-auto mb-3 text-gray-300" />
          <p>No medical records found</p>
        </div>
      ) : (
        <div className="divide-y">
          {records.map((record) => (
            <div key={record.id} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-medium text-lg">{record.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <Calendar size={14} className="mr-1" />
                    <span>{formatDate(record.date)}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                    <Eye size={16} className="mr-1" />
                    View
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 flex items-center text-sm">
                    <Download size={16} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{record.description}</p>
              
              {record.files.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Files:</p>
                  <div className="space-y-2">
                    {record.files.map((file) => (
                      <div key={file.id} className="flex items-center p-2 bg-gray-50 rounded">
                        <div className="p-2 bg-blue-100 rounded text-blue-700 mr-3">
                          <FileText size={16} />
                        </div>
                        
                        <div className="flex-1">
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{file.type}</p>
                        </div>
                        
                        <button className="text-blue-600 hover:text-blue-800">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MedicalRecordsList;