
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, fetchUserData } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import QRCodeGenerator from '../components/QRCodeGenerator';
import QRCodePopup from '../components/QRCodePopup';

const UserTickets: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any>({});
  const [tickets, setTickets] = useState<any>({});
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isQRPopupOpen, setIsQRPopupOpen] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        // Fetch user data
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
        
        // Fetch events
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        
        // Extract tickets
        if (data && data.tickets) {
          setTickets(data.tickets);
        }
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleTicketClick = (eventId: string, ticket: any) => {
    const eventName = eventId === 'food' 
      ? 'Food Ticket' 
      : eventId === 'foodTeam'
        ? 'Team Food Ticket'
        : events[eventId]?.name || 'Event Ticket';
    
    // Get the proper user name
    const userName = ticket.userName || userData?.name || 'Participant';
    
    setSelectedTicket({
      eventId,
      eventName,
      userName,
      ...ticket
    });
    
    setIsQRPopupOpen(true);
  };

  const closeQRPopup = () => {
    setIsQRPopupOpen(false);
    setSelectedTicket(null);
  };

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Check if user has no tickets
  const hasTickets = userData.tickets && Object.keys(userData.tickets).length > 0;
  
  if (!hasTickets) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tickets</h1>
          
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <h2 className="text-2xl font-bold mb-2">No Tickets Available</h2>
              <p className="text-gray-400 mb-6">
                You don't have any tickets yet. Register for events and complete payment to get tickets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/user/events')}
                  className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                >
                  Register for Events
                </button>
                <button 
                  onClick={() => navigate('/user/payments')}
                  className="px-6 py-2 border border-purple-600 text-purple-400 rounded hover:bg-purple-900 hover:bg-opacity-30"
                >
                  Complete Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter for event tickets and food tickets
  const eventTickets = Object.entries(tickets).filter(([key]) => key !== 'food' && key !== 'foodTeam');
  const foodTickets = Object.entries(tickets).filter(([key]) => key === 'food' || key === 'foodTeam');

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Your Tickets</h1>
        
        {foodTickets.length > 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Food Tickets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {foodTickets.map(([ticketKey, ticketData]: [string, any]) => {
                const isUsed = ticketData.status === "Not Yet Used" ? false : true;
                
                return (
                  <NeonCard 
                    key={ticketKey} 
                    type="faculty" 
                    className={`p-6 cursor-pointer ${isUsed ? 'opacity-60' : ''}`}
                    onClick={() => handleTicketClick(ticketKey, ticketData)}
                  >
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-xl font-semibold">
                        {ticketKey === 'foodTeam' ? 'Team Food Ticket' : 'Food Ticket'}
                      </h3>
                      <div className={`w-3 h-3 rounded-full ${ticketData.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                    </div>
                    
                    {ticketData.userName && (
                      <p className="text-sm text-gray-300 mb-4">For: {ticketData.userName}</p>
                    )}
                    
                    <div className="flex justify-center mb-4">
                      <QRCodeGenerator value={ticketData.qrCode} size={150} />
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Ticket Code</p>
                      <p className="text-2xl font-bold tracking-wider">{ticketData.code}</p>
                      <p className="mt-2 text-sm text-gray-300">Status: {ticketData.status}</p>
                    </div>
                  </NeonCard>
                );
              })}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Event Tickets</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventTickets.map(([eventId, ticketData]: [string, any]) => {
              const eventData = events[eventId] || { name: 'Unknown Event', type: 'technical' };
              const isParticipated = ticketData.status === "Participated";
              
              return (
                <NeonCard 
                  key={eventId} 
                  type={eventData.type === 'technical' ? 'tech' : 'nontech'} 
                  className={`p-6 cursor-pointer ${isParticipated ? 'opacity-60' : ''}`}
                  onClick={() => handleTicketClick(eventId, ticketData)}
                >
                  <div className="mb-4 flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{eventData.name}</h3>
                    <div className={`w-3 h-3 rounded-full ${ticketData.color === 'yellow' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                  </div>
                  
                  <div className="text-sm text-gray-400 mb-4">
                    <p>Venue: {eventData.venue}</p>
                    <p>Time: {eventData.time}</p>
                  </div>
                  
                  <div className="flex justify-center mb-4">
                    <QRCodeGenerator value={ticketData.qrCode} size={150} />
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Ticket Code</p>
                    <p className="text-2xl font-bold tracking-wider">{ticketData.code}</p>
                    <p className="mt-2 text-sm text-gray-300">Status: {ticketData.status}</p>
                  </div>
                </NeonCard>
              );
            })}
          </div>
        </div>
      </div>
      
      {selectedTicket && (
        <QRCodePopup
          isOpen={isQRPopupOpen}
          onClose={closeQRPopup}
          qrValue={selectedTicket.qrCode}
          code={selectedTicket.code}
          userName={selectedTicket.userName}
          eventName={selectedTicket.eventName}
        />
      )}
    </div>
  );
};

export default UserTickets;
