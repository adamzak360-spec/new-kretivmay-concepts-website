import { ReactNode, useEffect, useState } from "react";
import AdminLogin from "@/pages/AdminLogin";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via our new simple system
    const authToken = localStorage.getItem("adminAuth");
    if (authToken === "true") {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Show our new simple login page directly instead of redirecting to the broken auth
    return <AdminLogin />;
  }

  return <>{children}</>;
}
