
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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

const queryClient = new QueryClient();

// Auth protection component for staff routes
const StaffRoute = ({ children }: { children: JSX.Element }) => {
  const authType = localStorage.getItem('authType');
  
  if (authType !== 'staff') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Auth protection component for user routes
const UserRoute = ({ children }: { children: JSX.Element }) => {
  const authType = localStorage.getItem('authType');
  
  if (authType !== 'user') {
    return <Navigate to="/user/login" replace />;
  }
  
  return children;
};

const App = () => {
  // Check if user is already logged in and redirect accordingly
  useEffect(() => {
    const authType = localStorage.getItem('authType');
    
    if (window.location.pathname === '/') {
      if (authType === 'user') {
        window.location.href = '/user/dashboard';
      } else if (!authType) {
        window.location.href = '/login';
      }
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<StaffLogin />} />
            <Route path="/user/login" element={<UserLogin />} />
            <Route path="/user/register" element={<UserRegister />} />
            
            {/* Staff Routes */}
            <Route path="/" element={<StaffRoute><Index /></StaffRoute>} />
            <Route path="/patients" element={<StaffRoute><Layout><Patients /></Layout></StaffRoute>} />
            <Route path="/reminders" element={<StaffRoute><Layout><Reminders /></Layout></StaffRoute>} />
            <Route path="/deliveries" element={<StaffRoute><Layout><Deliveries /></Layout></StaffRoute>} />
            <Route path="/payments" element={<StaffRoute><Layout><Payments /></Layout></StaffRoute>} />
            
            {/* User Routes */}
            <Route path="/user/dashboard" element={<UserRoute><UserDashboard /></UserRoute>} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
