
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, fetchUserData } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';

const Dashboard: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [events, setEvents] = useState<any>({});
  const [eventStats, setEventStats] = useState({
    totalEvents: 0,
    registeredEvents: 0
  });

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
        
        // Calculate stats
        const totalEventsCount = Object.keys(eventsData).length;
        const registeredEventsCount = data?.eventsRegistered?.length || 0;
        
        setEventStats({
          totalEvents: totalEventsCount,
          registeredEvents: registeredEventsCount
        });
      }
    };
    
    loadData();
  }, [currentUser]);

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Welcome, {userData.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <NeonCard type="tech" className="p-6">
            <h2 className="text-xl font-semibold mb-2">Total Events</h2>
            <p className="text-4xl font-bold">{eventStats.totalEvents}</p>
          </NeonCard>
          
          <NeonCard type="nontech" className="p-6">
            <h2 className="text-xl font-semibold mb-2">Events Registered</h2>
            <p className="text-4xl font-bold">{eventStats.registeredEvents}</p>
          </NeonCard>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 gradient-text">Account Information</h2>
          
          <div className="bg-gray-900 bg-opacity-60 rounded-lg p-6 border border-purple-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400">Full Name</p>
                <p className="font-semibold">{userData.name}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Email</p>
                <p className="font-semibold">{userData.email}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Mobile</p>
                <p className="font-semibold">{userData.mobile}</p>
              </div>
              
              <div>
                <p className="text-gray-400">College</p>
                <p className="font-semibold">{userData.college}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Branch</p>
                <p className="font-semibold">{userData.branch}</p>
              </div>
              
              <div>
                <p className="text-gray-400">Year of Study</p>
                <p className="font-semibold">{userData.yearOfStudy}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6 gradient-text">What's Next?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NeonCard type="tech" className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/user/events')}>
              <h3 className="text-xl font-semibold mb-2">Register for Events</h3>
              <p>Browse and register for available events</p>
            </NeonCard>
            
            <NeonCard type="nontech" className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/user/payments')}>
              <h3 className="text-xl font-semibold mb-2">Make Payment</h3>
              <p>Complete your registration by making payment</p>
            </NeonCard>
            
            <NeonCard type="faculty" className="p-6 cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/user/tickets')}>
              <h3 className="text-xl font-semibold mb-2">View Tickets</h3>
              <p>Access your event tickets</p>
            </NeonCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
