import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchAllUsers, approvePayment, rejectPayment } from '../firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';
import { CheckCircle, XCircle, Download, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const AdminPayments: React.FC = () => {
  const { currentUser, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [users, setUsers] = useState<Record<string, any>>({});
  const [filteredUsers, setFilteredUsers] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

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
        const usersData = await fetchAllUsers();
        
        // Filter out users with no payment info
        const usersWithPayment: Record<string, any> = {};
        Object.entries(usersData).forEach(([userId, userData]: [string, any]) => {
          if (userData.payment) {
            usersWithPayment[userId] = userData;
          }
        });
        
        setUsers(usersWithPayment);
        applyFilters(usersWithPayment, searchQuery, filter);
      }
    };
    
    loadData();
  }, [currentUser, isAdmin]);

  const applyFilters = (usersData: Record<string, any>, query: string, statusFilter: string) => {
    let filtered = { ...usersData };
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = Object.entries(filtered).reduce((acc, [userId, userData]: [string, any]) => {
        if (userData.payment && userData.payment.status === statusFilter) {
          acc[userId] = userData;
        }
        return acc;
      }, {} as Record<string, any>);
    }
    
    // Apply search query
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = Object.entries(filtered).reduce((acc, [userId, userData]: [string, any]) => {
        const matchesName = userData.name?.toLowerCase().includes(lowerQuery);
        const matchesCollege = userData.college?.toLowerCase().includes(lowerQuery);
        const matchesMobile = userData.mobile?.includes(query);
        const matchesTxnId = userData.payment?.txnId?.toLowerCase().includes(lowerQuery);
        
        if (matchesName || matchesCollege || matchesMobile || matchesTxnId) {
          acc[userId] = userData;
        }
        return acc;
      }, {} as Record<string, any>);
    }
    
    setFilteredUsers(filtered);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    applyFilters(users, query, filter);
  };

  const handleFilterChange = (newFilter: 'all' | 'pending' | 'approved' | 'rejected') => {
    setFilter(newFilter);
    applyFilters(users, searchQuery, newFilter);
  };

  const handleApprove = async (userId: string) => {
    if (!currentUser || !isAdmin) return;
    
    try {
      setIsProcessing(userId);
      
      await approvePayment(userId);
      
      // Update local state
      const updatedUsers = { ...users };
      if (updatedUsers[userId]) {
        updatedUsers[userId] = {
          ...updatedUsers[userId],
          payment: {
            ...updatedUsers[userId].payment,
            status: 'approved'
          }
        };
      }
      setUsers(updatedUsers);
      applyFilters(updatedUsers, searchQuery, filter);
      
      toast({
        title: "Payment approved",
        description: `Payment for ${users[userId]?.name} has been approved and food tickets generated`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const handleReject = async (userId: string) => {
    if (!currentUser || !isAdmin) return;
    
    try {
      setIsProcessing(userId);
      
      await rejectPayment(userId);
      
      // Update local state
      const updatedUsers = { ...users };
      if (updatedUsers[userId]) {
        // Instead of removing from the list, update status to 'rejected' or remove payment info
        // Keep the user in the list for UI consistency
        updatedUsers[userId] = {
          ...updatedUsers[userId],
          payment: null
        };
      }
      
      setUsers(updatedUsers);
      applyFilters(updatedUsers, searchQuery, filter);
      
      toast({
        title: "Payment rejected",
        description: `Payment for ${users[userId]?.name} has been reset. They can make a new payment.`,
        variant: "default",
      });
    } catch (error: any) {
      toast({
        title: "Rejection failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(null);
    }
  };

  const exportToExcel = () => {
    // Prepare data for export
    const data = Object.entries(filteredUsers).map(([userId, userData]: [string, any]) => {
      return {
        'Name': userData.name,
        'College': userData.college,
        'Branch': userData.branch,
        'Mobile': userData.mobile,
        'Payment Method': userData.payment?.method,
        'Transaction ID': userData.payment?.txnId || '-',
        'Status': userData.payment?.status,
        'Amount': userData.payment?.amount,
        'Team Member': userData.payment?.teamMember || '-',
        'Events Registered': (userData.eventsRegistered || []).length
      };
    });
    
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    
    // Generate file and download
    XLSX.writeFile(wb, 'algotron_payments.xlsx');
    
    toast({
      title: "Export successful",
      description: "Payment data has been exported to Excel",
      variant: "default",
    });
  };

  if (loading || !isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Payment Management</h1>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md relative">
            <Input
              className="pl-10 bg-gray-900 border-gray-700 text-white"
              placeholder="Search by name, college, mobile or txn ID..."
              value={searchQuery}
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex">
          <div className="flex space-x-2">
  <Button 
    variant={filter === 'all' ? 'default' : 'outline'} 
    onClick={() => handleFilterChange('all')}
    className={`text-black ${filter === 'all' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}`}
  >
    All
  </Button>
  <Button 
    variant={filter === 'pending' ? 'default' : 'outline'} 
    onClick={() => handleFilterChange('pending')}
    className={`text-black ${filter === 'pending' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : ''}`}
  >
    Pending
  </Button>
  <Button 
    variant={filter === 'approved' ? 'default' : 'outline'} 
    onClick={() => handleFilterChange('approved')}
    className={`text-black ${filter === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
  >
    Approved
  </Button>
</div>
            
            <Button 
              variant="outline" 
              className="ml-4 text-black"
              onClick={exportToExcel}
            >
              <Download className="mr-h-4 w-4" />
              
            </Button>
          </div>
        </div>
        
        {Object.keys(filteredUsers).length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400">No payment records found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(filteredUsers).map(([userId, userData]: [string, any]) => {
              const paymentData = userData.payment;
              if (!paymentData) return null; // Skip if no payment data
              
              let cardType: "tech" | "nontech" | "faculty" = "tech";
              if (paymentData.status === 'approved') cardType = "faculty";
              else if (paymentData.status === 'rejected') cardType = "nontech";
              
              const isTeam = !!paymentData.teamMember;
              const isPending = paymentData.status === 'pending';
              
              return (
                <NeonCard key={userId} type={cardType} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{userData.name}</h3>
                    <div className={`px-2 py-1 rounded text-xs ${
                      paymentData.status === 'approved' 
                        ? 'bg-green-900 text-green-300' 
                        : paymentData.status === 'rejected' 
                          ? 'bg-red-900 text-red-300' 
                          : 'bg-yellow-900 text-yellow-300'
                    }`}>
                      {paymentData.status.charAt(0).toUpperCase() + paymentData.status.slice(1)}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">College</p>
                        <p>{userData.college}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Branch</p>
                        <p>{userData.branch}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Mobile</p>
                        <p>{userData.mobile}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Events</p>
                        <p>{(userData.eventsRegistered || []).length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Method</p>
                        <p className="capitalize">{paymentData.method}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p>₹{paymentData.amount}</p>
                      </div>
                      {paymentData.txnId && (
                        <div className="col-span-2">
                          <p className="text-gray-400">Transaction ID</p>
                          <p className="truncate">{paymentData.txnId}</p>
                        </div>
                      )}
                      {paymentData.teamMember && (
                        <div className="col-span-2">
                          <p className="text-gray-400">Team Member</p>
                          <p>{paymentData.teamMember}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isPending && (
                    <div className="flex space-x-2">
                      <Button
                        variant="default"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={isProcessing === userId}
                        onClick={() => handleApprove(userId)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-30"
                        disabled={isProcessing === userId}
                        onClick={() => handleReject(userId)}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </NeonCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPayments;
