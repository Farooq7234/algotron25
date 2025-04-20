
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserData, updatePayment } from '../firebase/firebase';
import { useToast } from '@/hooks/use-toast';
import Navbar from '../components/Navbar';
import NeonCard from '../components/ui/NeonCard';
import QRCodeGenerator from '../components/QRCodeGenerator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarClock, CreditCard, UserCheck, Wallet } from 'lucide-react';

const UserPayments: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'onspot'>('upi');
  const [txnId, setTxnId] = useState('');
  const [teamMember, setTeamMember] = useState('');
  const [isTeam, setIsTeam] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    if (!loading && !currentUser) {
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        const data = await fetchUserData(currentUser.uid);
        setUserData(data);
        setRegisteredEvents(data?.eventsRegistered || []);
        
        // If payment exists, set the state
        if (data?.payment) {
          setPaymentMethod(data.payment.method);
          if (data.payment.txnId) setTxnId(data.payment.txnId);
          if (data.payment.teamMember) {
            setTeamMember(data.payment.teamMember);
            setIsTeam(true);
          }
        }
      }
    };
    
    loadData();
  }, [currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (paymentMethod === 'upi' && !txnId.trim()) {
      toast({
        title: "Transaction ID required",
        description: "Please enter the transaction ID to continue",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const paymentData = {
        method: paymentMethod,
        status: 'pending', // All payments require admin approval
        amount: isTeam ? 250 : 200,
        txnId: paymentMethod === 'upi' ? txnId : null,
        teamMember: isTeam ? teamMember : null,
        timestamp: new Date().toISOString()
      };
      
      await updatePayment(currentUser.uid, paymentData);
      
      toast({
        title: "Payment information updated",
        description: "Your payment is pending approval from admin",
        variant: "default",
      });
      
      // Refresh user data
      const updatedData = await fetchUserData(currentUser.uid);
      setUserData(updatedData);
      
      // Navigate to tickets
      navigate('/user/tickets');
      
    } catch (error: any) {
      toast({
        title: "Payment update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !userData) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Check if user has registered for any events
  if (registeredEvents.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <div className="flex flex-col items-center justify-center py-20">
            <CalendarClock className="w-16 h-16 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Events Registered</h2>
            <p className="text-gray-400 mb-6 text-center max-w-md">
              You need to register for at least one event before making a payment.
            </p>
            <Button 
              onClick={() => navigate('/user/events')}
              className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Browse Events
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // If payment is already approved or rejected, show status
  if (userData.payment && userData.payment.status === 'approved') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Payment Status</h1>
          
          <NeonCard type="tech" className="p-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <UserCheck className="w-16 h-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Approved</h2>
              <p className="text-gray-300 mb-6">
                Your payment has been approved. You can now view your tickets.
              </p>
              
              <div className="w-full bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-gray-400">Method</p>
                    <p className="font-semibold capitalize">{userData.payment.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-semibold">₹{userData.payment.amount}</p>
                  </div>
                  {userData.payment.txnId && (
                    <div>
                      <p className="text-gray-400">Transaction ID</p>
                      <p className="font-semibold">{userData.payment.txnId}</p>
                    </div>
                  )}
                  {userData.payment.teamMember && (
                    <div>
                      <p className="text-gray-400">Team Member</p>
                      <p className="font-semibold">{userData.payment.teamMember}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/user/tickets')}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                View Tickets
              </Button>
            </div>
          </NeonCard>
        </div>
      </div>
    );
  }

  // If payment is pending approval
  if (userData.payment && userData.payment.status === 'pending') {
    return (
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        <div className="container mx-auto px-4 py-8 mt-16">
          <h1 className="text-3xl font-bold mb-8 gradient-text">Payment Status</h1>
          
          <NeonCard type="faculty" className="p-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <Wallet className="w-16 h-16 text-yellow-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Pending Approval</h2>
              <p className="text-gray-300 mb-6">
                Your payment is pending approval from the administrators. You will be notified once it's approved.
              </p>
              
              <div className="w-full bg-gray-800 bg-opacity-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <p className="text-gray-400">Method</p>
                    <p className="font-semibold capitalize">{userData.payment.method}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Amount</p>
                    <p className="font-semibold">₹{userData.payment.amount}</p>
                  </div>
                  {userData.payment.txnId && (
                    <div>
                      <p className="text-gray-400">Transaction ID</p>
                      <p className="font-semibold">{userData.payment.txnId}</p>
                    </div>
                  )}
                  {userData.payment.teamMember && (
                    <div>
                      <p className="text-gray-400">Team Member</p>
                      <p className="font-semibold">{userData.payment.teamMember}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => navigate('/user/tickets')}
                className="px-6 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                View Tickets
              </Button>
            </div>
          </NeonCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Payment</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <NeonCard type="tech" className="p-6">
            <h2 className="text-xl font-bold mb-4">Payment Information</h2>
            
            <div className="mb-6">
              <p className="text-lg font-semibold mb-2">Registration Type</p>
              <div className="flex items-center space-x-4 mb-4">
                <Button
                  variant={!isTeam ? "default" : "outline"}
                  onClick={() => setIsTeam(false)}
                  className={!isTeam ? "bg-purple-600 hover:bg-purple-700" : "text-black"}
                >
                  Individual (₹200)
                </Button>
                <Button
                  variant={isTeam ? "default" : "outline"}
                  onClick={() => setIsTeam(true)}
                  className={isTeam ? "bg-purple-600 hover:bg-purple-700" : "text-black"}
                >
                  Team (₹250)
                </Button>
              </div>
              
              {isTeam && (
                <div className="mb-4">
                  <Label htmlFor="teamMember">Team Member Name</Label>
                  <Input
                    id="teamMember"
                    type="text"
                    value={teamMember}
                    onChange={(e) => setTeamMember(e.target.value)}
                    placeholder="Enter team member's name"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Payment Method</p>
                <RadioGroup value={paymentMethod} onValueChange={(val: 'upi' | 'onspot') => setPaymentMethod(val)}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="upi" id="upi" className="border-white bg-white text-black data-[state=checked]:bg-white data-[state=checked]:border-white" />
                    <Label htmlFor="upi">UPI Payment</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="onspot" id="onspot" className="border-white bg-white text-black data-[state=checked]:bg-white data-[state=checked]:border-white"/>
                    <Label htmlFor="onspot">On-Spot Payment</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'upi' && (
                <div className="mb-6">
                  <Label htmlFor="txnId">Transaction ID</Label>
                  <Input
                    id="txnId"
                    type="text"
                    value={txnId}
                    onChange={(e) => setTxnId(e.target.value)}
                    placeholder="Enter your transaction ID"
                    className="bg-gray-800 border-gray-700 text-white"
                    required={paymentMethod === 'upi'}
                  />
                </div>
              )}
              
              <Button
                type="submit"
                disabled={isSubmitting || (paymentMethod === 'upi' && !txnId.trim()) || (isTeam && !teamMember.trim())}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? 'Processing...' : 'Submit Payment Information'}
              </Button>
              
              <p className="mt-4 text-yellow-400 text-sm">
                Note: All payments require admin approval, including on-spot payments
              </p>
            </form>
          </NeonCard>
          
          {paymentMethod === 'upi' && (
            <div className="flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Scan QR Code to Pay</h2>
            <NeonCard type="nontech" className="p-6 flex flex-col items-center">
              <img
                src={isTeam ? "/QR/250.jpg" : "/QR/150.jpg"}
                alt="Payment QR"
                width={200}
                height={200}
                className="rounded"
              />
              <div className="mt-4 text-center">
                <p className="text-lg font-bold">Amount: ₹{isTeam ? '250' : '200'}</p>
                <p className="text-sm text-gray-400 mt-2">
                  After payment, copy the transaction ID and paste it above
                </p>
              </div>
            </NeonCard>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPayments;
