
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import UserEvents from "./pages/UserEvents";
import UserPayments from "./pages/UserPayments";
import UserTickets from "./pages/UserTickets";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminPayments from "./pages/AdminPayments";
import AdminAttendance from "./pages/AdminAttendance";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const queryClient = new QueryClient();

// Protected route wrapper for user routes
const ProtectedUserRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading, isEmailVerified } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isEmailVerified) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Protected route wrapper for admin routes
const ProtectedAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { currentUser, loading, isAdmin } = useAuth();
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedUserRoute>
                <Dashboard />
              </ProtectedUserRoute>
            } />
            <Route path="/user/events" element={
              <ProtectedUserRoute>
                <UserEvents />
              </ProtectedUserRoute>
            } />
            <Route path="/user/payments" element={
              <ProtectedUserRoute>
                <UserPayments />
              </ProtectedUserRoute>
            } />
            <Route path="/user/tickets" element={
              <ProtectedUserRoute>
                <UserTickets />
              </ProtectedUserRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedAdminRoute>
                <AdminEvents />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/payments" element={
              <ProtectedAdminRoute>
                <AdminPayments />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/attendance" element={
              <ProtectedAdminRoute>
                <AdminAttendance />
              </ProtectedAdminRoute>
            } />
            
            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
