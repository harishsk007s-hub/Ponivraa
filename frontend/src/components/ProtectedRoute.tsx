import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#2E7D32]/20 border-t-[#2E7D32] animate-spin mb-4" />
        <div className="flex items-center gap-2 text-[#1B4332] font-bold">
          <Sprout className="w-5 h-5 text-primary" />
          <span>Verifying Admin Authorization...</span>
        </div>
      </div>
    );
  }

  // If unauthenticated, redirect immediately to /admin/login with state preservation
  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
