import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Message, User } from '../types';
import Chat from '../components/teleconsultation/Chat';
import { Search } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    if (!user) return;
    
    const fetchMessages = async () => {
      try {
        const messagesData = await api.getMessages(user.id);
        setMessages(messagesData);
        
        // In a real app, we would fetch the actual contacts
        // For demo, we'll create a mock contact
        if (user.role === 'patient') {
          setContacts([
            {
              id: 'd1',
              email: 'doctor@example.com',
              firstName: 'John',
              lastName: 'Smith',
              role: 'doctor',
              specialtyId: 's1',
              profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }
          ]);
          setSelectedContact({
            id: 'd1',
            email: 'doctor@example.com',
            firstName: 'John',
            lastName: 'Smith',
            role: 'doctor',
            specialtyId: 's1',
            profileImage: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          });
        } else {
          setContacts([
            {
              id: 'p1',
              email: 'patient@example.com',
              firstName: 'Jane',
              lastName: 'Doe',
              role: 'patient',
              profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
            }
          ]);
          setSelectedContact({
            id: 'p1',
            email: 'patient@example.com',
            firstName: 'Jane',
            lastName: 'Doe',
            role: 'patient',
            profileImage: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
          });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMessages();
  }, [user]);
  
  const handleContactSelect = (contact: User) => {
    setSelectedContact(contact);
  };
  
  const handleSendMessage = async (content: string, attachment?: File) => {
    if (!user || !selectedContact) return;
    
    try {
      const newMessage = await api.sendMessage({
        senderId: user.id,
        receiverId: selectedContact.id,
        content,
        attachmentUrl: attachment ? URL.createObjectURL(attachment) : undefined
      });
      
      setMessages(prev => [...prev, newMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const filteredContacts = contacts.filter(contact => 
    `${contact.firstName} ${contact.lastName}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
  
  if (!user) {
    return null;
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-gray-600">Secure messaging with your healthcare providers</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col md:flex-row h-[600px]">
          {/* Contacts sidebar */}
          <div className="w-full md:w-64 border-r flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search contacts..."
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No contacts found
                </div>
              ) : (
                <div>
                  {filteredContacts.map((contact) => (
                    <div
                      key={contact.id}
                      onClick={() => handleContactSelect(contact)}
                      className={`
                        p-3 cursor-pointer
                        ${selectedContact?.id === contact.id 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                        }
                      `}
                    >
                      <div className="flex items-center">
                        {contact.profileImage ? (
                          <img
                            src={contact.profileImage}
                            alt={`${contact.firstName} ${contact.lastName}`}
                            className="w-10 h-10 rounded-full object-cover mr-3"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
                            <span className="text-white font-medium">
                              {contact.firstName?.charAt(0)}
                              {contact.lastName?.charAt(0)}
                            </span>
                          </div>
                        )}
                        
                        <div>
                          <h3 className="text-sm font-medium">
                            {contact.role === 'doctor' ? 'Dr. ' : ''}
                            {contact.firstName} {contact.lastName}
                          </h3>
                          <p className="text-xs text-gray-500 capitalize">
                            {contact.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Chat area */}
          <div className="flex-1">
            {selectedContact ? (
              <Chat
                messages={messages}
                currentUser={user}
                receiver={selectedContact}
                onSendMessage={handleSendMessage}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <p className="text-gray-500">
                    Select a contact to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;