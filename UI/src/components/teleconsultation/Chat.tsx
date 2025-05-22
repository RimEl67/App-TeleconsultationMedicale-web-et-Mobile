import React, { useState, useEffect, useRef } from 'react';
import { Message, User } from '../../types';
import { Send, Paperclip } from 'lucide-react';

interface ChatProps {
  messages: Message[];
  currentUser: User;
  receiver: User;
  onSendMessage: (content: string, attachment?: File) => void;
}

const Chat: React.FC<ChatProps> = ({ messages, currentUser, receiver, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      onSendMessage(newMessage, attachment || undefined);
      setNewMessage('');
      setAttachment(null);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachment(e.target.files[0]);
    }
  };
  
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b flex items-center">
        {receiver.profileImage ? (
          <img 
            src={receiver.profileImage} 
            alt={`${receiver.firstName} ${receiver.lastName}`} 
            className="w-10 h-10 rounded-full mr-3 object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3">
            <span className="text-white font-medium">
              {receiver.firstName?.charAt(0)}
              {receiver.lastName?.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <h3 className="font-medium">
            {receiver.role === 'doctor' ? 'Dr. ' : ''}
            {receiver.firstName} {receiver.lastName}
          </h3>
          <p className="text-sm text-gray-500 capitalize">{receiver.role}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            
            return (
              <div 
                key={message.id} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-xs sm:max-w-md rounded-lg p-3
                    ${isCurrentUser
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow'
                    }
                  `}
                >
                  <div>{message.content}</div>
                  {message.attachmentUrl && (
                    <div className="mt-2">
                      <a 
                        href={message.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={`
                          text-sm underline
                          ${isCurrentUser ? 'text-blue-100' : 'text-blue-600'}
                        `}
                      >
                        View attachment
                      </a>
                    </div>
                  )}
                  <div 
                    className={`
                      text-xs mt-1
                      ${isCurrentUser ? 'text-blue-200' : 'text-gray-500'}
                    `}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 border-t">
        {attachment && (
          <div className="mb-2 p-2 bg-blue-50 rounded text-sm flex justify-between items-center">
            <span className="truncate">{attachment.name}</span>
            <button
              type="button"
              onClick={() => setAttachment(null)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Remove
            </button>
          </div>
        )}
        
        <div className="flex items-center">
          <label className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer">
            <Paperclip size={20} />
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700"
            disabled={!newMessage.trim()}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;