import React from 'react';
import { Message } from '../../types';
import { MessageSquare } from 'lucide-react';

interface RecentMessagesProps {
  messages: Message[];
}

const RecentMessages: React.FC<RecentMessagesProps> = ({ messages }) => {
  // Format timestamp to display in a more readable format
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 h-full">
      <div className="flex items-center mb-5">
        <MessageSquare size={20} className="text-teal-500 mr-2" />
        <h2 className="text-lg font-semibold">Recent Messages</h2>
      </div>
      
      <div className="space-y-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <div key={message.id} className={`p-3 rounded-lg ${!message.read ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium">Dr. Smith</span>
                <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
              </div>
              
              <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                {message.content}
              </p>
              
              <div className="flex justify-end">
                <button className="text-sm text-blue-600 hover:text-blue-800">
                  Reply
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No recent messages</p>
          </div>
        )}
      </div>
      
      {messages.length > 0 && (
        <div className="mt-5 text-center">
          <button className="text-teal-600 hover:text-teal-800 text-sm font-medium">
            View all messages
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentMessages;