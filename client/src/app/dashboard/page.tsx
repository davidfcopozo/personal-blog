import ProtectedRoute from "@/components/ProtectedRoute";
import { Dashboard } from "@/components/dashboard";
import React from "react";

const DashboardPage = () => {
  return (
    <div>
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    </div>
  );
};

export default DashboardPage;
