
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchEvents, fetchAllUsers } from '../firebase/firebase';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Calendar, CreditCard, TicketCheck } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState<any>({});
  const [users, setUsers] = useState<any>({});
  const [eventStats, setEventStats] = useState<any[]>([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalRegistrations: 0,
    pendingPayments: 0,
    approvedPayments: 0
  });

  useEffect(() => {
    if (!loading) {
      if (!currentUser) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/dashboard');
      }
    }
  }, [currentUser, loading, isAdmin, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser && isAdmin) {
        // Fetch events
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        
        // Fetch all users
        const usersData = await fetchAllUsers();
        setUsers(usersData);
        
        // Calculate event stats
        const stats: any[] = [];
        let totalRegistrations = 0;
        let pendingPayments = 0;
        let approvedPayments = 0;
        
        // Count registrations per event
        Object.entries(eventsData).forEach(([eventId, eventData]: [string, any]) => {
          let count = 0;
          
          Object.values(usersData || {}).forEach((user: any) => {
            if (user.eventsRegistered && user.eventsRegistered.includes(eventId)) {
              count++;
              totalRegistrations++;
            }
          });
          
          stats.push({
            name: eventData.name,
            registrations: count,
            type: eventData.type
          });
        });
        
        // Count payment statuses
        Object.values(usersData || {}).forEach((user: any) => {
          if (user.payment) {
            if (user.payment.status === 'pending') {
              pendingPayments++;
            } else if (user.payment.status === 'approved') {
              approvedPayments++;
            }
          }
        });
        
        setEventStats(stats);
        setSummary({
          totalUsers: Object.keys(usersData || {}).length,
          totalRegistrations,
          pendingPayments,
          approvedPayments
        });
      }
    };
    
    loadData();
  }, [currentUser, isAdmin]);

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <NeonCard type="tech" className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-purple-900 bg-opacity-50">
                <Users className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <h3 className="text-2xl font-bold">{summary.totalUsers}</h3>
              </div>
            </div>
          </NeonCard>
          
          <NeonCard type="nontech" className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-indigo-900 bg-opacity-50">
                <Calendar className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Registrations</p>
                <h3 className="text-2xl font-bold">{summary.totalRegistrations}</h3>
              </div>
            </div>
          </NeonCard>
          
          <NeonCard type="faculty" className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-yellow-900 bg-opacity-50">
                <CreditCard className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Pending Payments</p>
                <h3 className="text-2xl font-bold">{summary.pendingPayments}</h3>
              </div>
            </div>
          </NeonCard>
          
          <NeonCard type="sponsor" className="p-6">
            <div className="flex items-center">
              <div className="mr-4 p-3 rounded-full bg-green-900 bg-opacity-50">
                <TicketCheck className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Approved Payments</p>
                <h3 className="text-2xl font-bold">{summary.approvedPayments}</h3>
              </div>
            </div>
          </NeonCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <NeonCard type="tech" className="p-6">
            <h2 className="text-xl font-bold mb-6">Event Registration Statistics</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventStats}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" tick={{ fill: '#ddd' }} />
                  <YAxis tick={{ fill: '#ddd' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#555' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey="registrations" 
                    fill="#8884d8" 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeonCard>
          
          <NeonCard type="nontech" className="p-6">
            <h2 className="text-xl font-bold mb-6">Event Type Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { 
                      name: 'Technical', 
                      count: eventStats.filter(e => e.type === 'technical').reduce((sum, e) => sum + e.registrations, 0)
                    },
                    { 
                      name: 'Non-Technical', 
                      count: eventStats.filter(e => e.type === 'non-technical').reduce((sum, e) => sum + e.registrations, 0)
                    }
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis dataKey="name" tick={{ fill: '#ddd' }} />
                  <YAxis tick={{ fill: '#ddd' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#555' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#82ca9d" 
                    isAnimationActive={true}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </NeonCard>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NeonCard 
            type="tech" 
            className="p-6 cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => navigate('/admin/events')}
          >
            <div className="flex items-center mb-4">
              <Calendar className="h-8 w-8 text-purple-400 mr-3" />
              <h3 className="text-xl font-bold">Manage Events</h3>
            </div>
            <p className="text-gray-300">
              View and update event details, toggle registration status
            </p>
          </NeonCard>
          
          <NeonCard 
            type="nontech" 
            className="p-6 cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => navigate('/admin/payments')}
          >
            <div className="flex items-center mb-4">
              <CreditCard className="h-8 w-8 text-indigo-400 mr-3" />
              <h3 className="text-xl font-bold">Payment Manager</h3>
            </div>
            <p className="text-gray-300">
              Review and approve payment requests, generate food tickets
            </p>
          </NeonCard>
          
          <NeonCard 
            type="faculty" 
            className="p-6 cursor-pointer hover:scale-105 transition-transform" 
            onClick={() => navigate('/admin/attendance')}
          >
            <div className="flex items-center mb-4">
              <TicketCheck className="h-8 w-8 text-yellow-400 mr-3" />
              <h3 className="text-xl font-bold">Attendance Tracking</h3>
            </div>
            <p className="text-gray-300">
              Scan tickets, mark attendance, track participation
            </p>
          </NeonCard>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
