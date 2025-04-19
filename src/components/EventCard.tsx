import React, { useState } from 'react';
import NeonCard from './ui/NeonCard';
import Modal from './ui/Modal';
import { Link } from 'react-router-dom';


interface EventProps {
  id: string;
  name: string;
  type: 'technical' | 'non-technical';
  description: string;
  rules: string;
  venue: string;
  time: string;
  registrationOpen: boolean;
  image: string;
  // Added new properties for the extended modal
  duration?: {
    prelims: string;
    finals: string;
  };
  teamInfo?: string;
  coordinators?: Array<{
    name: string;
    phone: string;
  }>;
}

const EventCard: React.FC<EventProps> = ({
  id,
  name,
  type,
  description,
  rules,
  venue,
  time,
  registrationOpen,
  image,
  duration,
  teamInfo,
  coordinators
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const cardType = type === 'technical' ? 'tech' : 'nontech';
  
  return (
    <>
      <NeonCard 
        type={cardType} 
        className="cursor-pointer h-full flex flex-col"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full aspect-square object-contain object-center transition-transform hover:scale-105" 
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
            
          </div>
        </div>
        <div className="p-4 flex justify-end">
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-800 text-white rounded-md  transition-colors">
            Explore
          </button>
        </div>
      </NeonCard>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={name}
      >
        <div className="space-y-4">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-64 object-cover rounded-md transition-transform hover:scale-105" 
          />
          
          <div>
            <h4 className="text-lg font-semibold text-purple-400">Description</h4>
            <p className="text-gray-300">{description}</p>
          </div>
          
          {duration && (
            <div>
              <h4 className="text-lg font-semibold text-purple-400">Time</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
                <div><span className="font-medium">Prelims:</span> {duration.prelims}</div>
                <div><span className="font-medium">Finals:</span> {duration.finals}</div>
              </div>
            </div>
          )}
          
          {teamInfo && (
            <div>
              <h4 className="text-lg font-semibold text-purple-400">Team Info</h4>
              <p className="text-gray-300">{teamInfo}</p>
            </div>
          )}
          
          {coordinators && coordinators.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-purple-400">Coordinators</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {coordinators.map((coordinator, index) => (
                  <div key={index} className="text-gray-300">
                    <p className="font-medium">{coordinator.name}</p>
                    <p>{coordinator.phone}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div>
            <h4 className="text-lg font-semibold text-purple-400">Rules</h4>
            <p className="text-gray-300">{rules}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold text-purple-400">Venue</h4>
              <p className="text-gray-300">{venue}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-purple-400">Time</h4>
              <p className="text-gray-300">{time}</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-2">Registration Status:</span>
                {registrationOpen ? (
                  <span className="text-green-500 text-sm">Open</span>
                ) : (
                  <span className="text-red-500 text-sm">Closed</span>
                )}
              </div>
              
              <Link to="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
  Register
</Link>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default EventCard;