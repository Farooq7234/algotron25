
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, fetchUserData, registerForEvent, withdrawFromEvent } from '../firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, AlertCircle } from 'lucide-react';

const UserEvents: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [events, setEvents] = useState<any>({});
  const [userData, setUserData] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        // Fetch events
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        
        // Fetch user data
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
        setRegisteredEvents(data?.eventsRegistered || []);
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleRegister = async (eventId: string) => {
    if (!currentUser) return;
    
    try {
      setIsRegistering(true);
      await registerForEvent(currentUser.uid, eventId);
      
      // Update registered events
      setRegisteredEvents(prev => [...prev, eventId]);
      
      toast({
        title: "Successfully registered!",
        description: `You have registered for ${events[eventId].name}`,
        variant: "default",
      });
      
      // Navigate to payments if first event registration
      if (registeredEvents.length === 0) {
        navigate('/user/payments');
      }
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleWithdraw = async (eventId: string) => {
    if (!currentUser) return;
    
    try {
      setIsRegistering(true);
      await withdrawFromEvent(currentUser.uid, eventId);
      
      // Update registered events
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      
      toast({
        title: "Withdrawn successfully",
        description: `You have withdrawn from ${events[eventId].name}`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Withdrawal failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Split events into technical and non-technical
  const technicalEvents = Object.entries(events).filter(([_, event]: [string, any]) => event.type === 'technical');
  const nonTechnicalEvents = Object.entries(events).filter(([_, event]: [string, any]) => event.type === 'non-technical');

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Event Registration</h1>
        
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Technical Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technicalEvents.map(([eventId, eventData]: [string, any]) => (
              <NeonCard 
                key={eventId} 
                type="tech" 
                className="relative p-6 overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  {!eventData.registrationOpen ? (
                    <Badge variant="outline" className="bg-red-900 text-white">
                      <AlertCircle className="w-4 h-4 mr-1" /> Closed
                    </Badge>
                  ) : (
                    registeredEvents.includes(eventId) ? (
                      <Badge variant="outline" className="bg-green-900 text-white">
                        <CircleCheck className="w-4 h-4 mr-1" /> Registered
                      </Badge>
                    ) : null
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{eventData.name}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{eventData.description}</p>
                <div className="text-sm text-gray-400 mb-4">
                  <p>Venue: {eventData.venue}</p>
                  <p>Time: {eventData.time}</p>
                </div>
                
                {registeredEvents.includes(eventId) ? (
                  <button 
                    className={`w-full px-4 py-2 rounded border border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition-colors ${!eventData.registrationOpen || isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleWithdraw(eventId)}
                    disabled={!eventData.registrationOpen || isRegistering}
                  >
                    Withdraw
                  </button>
                ) : (
                  <button 
                    className={`w-full px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors ${!eventData.registrationOpen || isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleRegister(eventId)}
                    disabled={!eventData.registrationOpen || isRegistering}
                  >
                    Register
                  </button>
                )}
              </NeonCard>
            ))}
          </div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold mb-6">Non-Technical Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nonTechnicalEvents.map(([eventId, eventData]: [string, any]) => (
              <NeonCard 
                key={eventId} 
                type="nontech" 
                className="relative p-6 overflow-hidden"
              >
                <div className="absolute top-4 right-4">
                  {!eventData.registrationOpen ? (
                    <Badge variant="outline" className="bg-red-900 text-white">
                      <AlertCircle className="w-4 h-4 mr-1" /> Closed
                    </Badge>
                  ) : (
                    registeredEvents.includes(eventId) ? (
                      <Badge variant="outline" className="bg-green-900 text-white">
                        <CircleCheck className="w-4 h-4 mr-1" /> Registered
                      </Badge>
                    ) : null
                  )}
                </div>
                
                <h3 className="text-xl font-semibold mb-2">{eventData.name}</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">{eventData.description}</p>
                <div className="text-sm text-gray-400 mb-4">
                  <p>Venue: {eventData.venue}</p>
                  <p>Time: {eventData.time}</p>
                </div>
                
                {registeredEvents.includes(eventId) ? (
                  <button 
                    className={`w-full px-4 py-2 rounded border border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-30 transition-colors ${!eventData.registrationOpen || isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleWithdraw(eventId)}
                    disabled={!eventData.registrationOpen || isRegistering}
                  >
                    Withdraw
                  </button>
                ) : (
                  <button 
                    className={`w-full px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors ${!eventData.registrationOpen || isRegistering ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => handleRegister(eventId)}
                    disabled={!eventData.registrationOpen || isRegistering}
                  >
                    Register
                  </button>
                )}
              </NeonCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserEvents;
