
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import Patients from "./pages/Patients";
import Reminders from "./pages/Reminders";
import Deliveries from "./pages/Deliveries";
import Payments from "./pages/Payments";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import StaffLogin from "./pages/auth/StaffLogin";
import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import UserMedications from "./pages/user/UserMedications";
import UserPayments from "./pages/user/UserPayments";
import UserReminders from "./pages/user/UserReminders";

const queryClient = new QueryClient();

// Auth protection component for staff routes
const StaffRoute = ({ children }: { children: JSX.Element }) => {
  const authType = localStorage.getItem('authType');
  const location = useLocation();
  
  if (authType !== 'staff') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  return children;
};

// Auth protection component for user routes
const UserRoute = ({ children }: { children: JSX.Element }) => {
  const authType = localStorage.getItem('authType');
  const location = useLocation();
  
  if (authType !== 'user') {
    return <Navigate to="/user/login" replace state={{ from: location }} />;
  }
  
  return children;
};

// Authentication check for public routes
const AuthCheck = () => {
  const navigate = useNavigate();
  const authType = localStorage.getItem('authType');
  
  useEffect(() => {
    if (authType === 'user') {
      navigate('/user/dashboard', { replace: true });
    } else if (authType === 'staff') {
      navigate('/dashboard', { replace: true });
    }
  }, [authType, navigate]);
  
  return null;
};

// Root component to handle initial redirection
const RootRedirect = () => {
  const navigate = useNavigate();
  const authType = localStorage.getItem('authType');
  
  useEffect(() => {
    if (authType === 'user') {
      navigate('/user/dashboard', { replace: true });
    } else if (authType === 'staff') {
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true }); // Default to staff login page
    }
  }, [authType, navigate]);
  
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Root route for redirecting based on auth */}
            <Route path="/" element={<RootRedirect />} />
            
            {/* Authentication Routes with AuthCheck */}
            <Route path="/login" element={
              <>
                <AuthCheck />
                <StaffLogin />
              </>
            } />
            <Route path="/user/login" element={
              <>
                <AuthCheck />
                <UserLogin />
              </>
            } />
            <Route path="/user/register" element={
              <>
                <AuthCheck />
                <UserRegister />
              </>
            } />
            
            {/* Staff Routes */}
            <Route path="/dashboard" element={<StaffRoute><Layout><Index /></Layout></StaffRoute>} />
            <Route path="/patients" element={<StaffRoute><Layout><Patients /></Layout></StaffRoute>} />
            <Route path="/reminders" element={<StaffRoute><Layout><Reminders /></Layout></StaffRoute>} />
            <Route path="/deliveries" element={<StaffRoute><Layout><Deliveries /></Layout></StaffRoute>} />
            <Route path="/payments" element={<StaffRoute><Layout><Payments /></Layout></StaffRoute>} />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            <Route path="/user/medications" element={<UserRoute><UserMedications /></UserRoute>} />
            <Route path="/user/reminders" element={<UserRoute><UserReminders /></UserRoute>} />
            <Route path="/user/payments" element={<UserRoute><UserPayments /></UserRoute>} />
            
            {/* Catch-all route - redirect to login based on preferred portal */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
