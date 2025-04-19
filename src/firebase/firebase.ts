
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, User } from 'firebase/auth';
import { getDatabase, ref, set, get, update, remove, onValue, off, push, child } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyALm182lLN2N2xdvJ2pcp4MUoCMtZknQhs",
  authDomain: "algotronv4-9c923.firebaseapp.com",
  databaseURL: "https://algotronv4-9c923-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "algotronv4-9c923",
  storageBucket: "algotronv4-9c923.firebasestorage.app",
  messagingSenderId: "1005461963991",
  appId: "1:1005461963991:web:c9ede9770b6d3a408c1c92",
  measurementId: "G-3S9XSMFDHJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Authentication functions
export const registerUser = async (email: string, password: string, userData: any) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    
    // Save user data to the database
    await set(ref(database, `users/${userCredential.user.uid}`), {
      ...userData,
      email,
      eventsRegistered: [],
      payment: null,
      tickets: {}
    });
    
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { success: true, user: userCredential.user };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

// Database functions
export const fetchEvents = async () => {
  try {
    const eventsRef = ref(database, 'events');
    const snapshot = await get(eventsRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return {};
  }
};

export const fetchUserData = async (userId: string) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const updateUserData = async (userId: string, data: any) => {
  try {
    const userRef = ref(database, `users/${userId}`);
    await update(userRef, data);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating user data:", error);
    return { success: false, error: error.message };
  }
};

export const registerForEvent = async (userId: string, eventId: string) => {
  try {
    const userEventsRef = ref(database, `users/${userId}/eventsRegistered`);
    const snapshot = await get(userEventsRef);
    
    let eventsRegistered = [];
    if (snapshot.exists()) {
      eventsRegistered = snapshot.val();
    }
    
    if (!eventsRegistered.includes(eventId)) {
      eventsRegistered.push(eventId);
      await set(userEventsRef, eventsRegistered);
      
      // Generate ticket
      const ticketCode = generateTicketCode();
      await set(ref(database, `users/${userId}/tickets/${eventId}`), {
        qrCode: `QR_${userId}_${eventId}`,
        code: ticketCode,
        status: "Not Yet Participated",
        color: "yellow"
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error registering for event:", error);
    return { success: false, error: error.message };
  }
};

export const withdrawFromEvent = async (userId: string, eventId: string) => {
  try {
    const userEventsRef = ref(database, `users/${userId}/eventsRegistered`);
    const snapshot = await get(userEventsRef);
    
    if (snapshot.exists()) {
      const eventsRegistered = snapshot.val().filter((id: string) => id !== eventId);
      await set(userEventsRef, eventsRegistered);
      
      // Remove ticket
      await remove(ref(database, `users/${userId}/tickets/${eventId}`));
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error withdrawing from event:", error);
    return { success: false, error: error.message };
  }
};

export const updatePayment = async (userId: string, paymentData: any) => {
  try {
    // All payments should be in 'pending' status, including on-spot payments
    const updatedPaymentData = {
      ...paymentData,
      status: 'pending'
    };
    
    const paymentRef = ref(database, `users/${userId}/payment`);
    await set(paymentRef, updatedPaymentData);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating payment:", error);
    return { success: false, error: error.message };
  }
};

export const resetPayment = async (userId: string) => {
  try {
    const paymentRef = ref(database, `users/${userId}/payment`);
    await remove(paymentRef);
    return { success: true };
  } catch (error: any) {
    console.error("Error resetting payment:", error);
    return { success: false, error: error.message };
  }
};

export const updateAttendance = async (userId: string, eventId: string) => {
  try {
    const ticketRef = ref(database, `users/${userId}/tickets/${eventId}`);
    
    // Check if it's a food ticket
    if (eventId === 'food' || eventId === 'foodTeam') {
      await update(ticketRef, {
        status: "Ticket Used",
        color: "green"
      });
    } else {
      await update(ticketRef, {
        status: "Participated",
        color: "green"
      });
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating attendance:", error);
    return { success: false, error: error.message };
  }
};

export const updateEventStatus = async (eventId: string, isOpen: boolean) => {
  try {
    const eventRef = ref(database, `events/${eventId}/registrationOpen`);
    await set(eventRef, isOpen);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event status:", error);
    return { success: false, error: error.message };
  }
};

// New function to update event details
export const updateEventDetails = async (eventId: string, eventData: any) => {
  try {
    const eventRef = ref(database, `events/${eventId}`);
    await update(eventRef, eventData);
    return { success: true };
  } catch (error: any) {
    console.error("Error updating event details:", error);
    return { success: false, error: error.message };
  }
};

export const fetchAllUsers = async () => {
  try {
    const usersRef = ref(database, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return {};
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return {};
  }
};

export const approvePayment = async (userId: string) => {
  try {
    // Get user payment data first
    const userRef = ref(database, `users/${userId}`);
    const snapshot = await get(userRef);
    
    if (snapshot.exists()) {
      const userData = snapshot.val();
      const paymentData = userData.payment;
      
      if (!paymentData) {
        throw new Error("No payment data found");
      }
      
      // Approve the payment
      const paymentRef = ref(database, `users/${userId}/payment`);
      await update(paymentRef, { status: 'approved' });
      
      // Generate food tickets based on payment type
      const isTeam = !!paymentData.teamMember;
      const userName = userData.name || '';
      
      // Generate individual food ticket
      const ticketCode1 = generateTicketCode();
      await set(ref(database, `users/${userId}/tickets/food`), {
        qrCode: `QR_${userId}_food`,
        code: ticketCode1,
        status: "Not Yet Used",
        color: "yellow",
        userName: userName
      });
      
      // Generate team member food ticket if applicable
      if (isTeam && paymentData.teamMember) {
        const ticketCode2 = generateTicketCode();
        await set(ref(database, `users/${userId}/tickets/foodTeam`), {
          qrCode: `QR_${userId}_foodTeam`,
          code: ticketCode2,
          status: "Not Yet Used",
          color: "yellow",
          userName: paymentData.teamMember
        });
      }
      
      return { success: true };
    } else {
      throw new Error("User not found");
    }
  } catch (error: any) {
    console.error("Error approving payment:", error);
    return { success: false, error: error.message };
  }
};

export const rejectPayment = async (userId: string) => {
  try {
    // Reset payment instead of marking as rejected
    await resetPayment(userId);
    return { success: true };
  } catch (error: any) {
    console.error("Error rejecting payment:", error);
    return { success: false, error: error.message };
  }
};

// Helper functions
const generateTicketCode = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Event listeners
export const subscribeToEvents = (callback: (events: any) => void) => {
  const eventsRef = ref(database, 'events');
  
  onValue(eventsRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback({});
    }
  });
  
  return () => off(eventsRef);
};

export const subscribeToUserData = (userId: string, callback: (userData: any) => void) => {
  const userRef = ref(database, `users/${userId}`);
  
  onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    } else {
      callback(null);
    }
  });
  
  return () => off(userRef);
};

export { auth, database };
