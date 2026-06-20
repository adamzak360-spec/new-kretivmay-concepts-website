import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import SignIn from "@/components/auth/SignIn";
import SignUp from "@/components/auth/SignUp";

export default function Auth() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      setLocation("/account");
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-md mx-auto">
        {mode === "signin" ? (
          <SignIn onToggleMode={() => setMode("signup")} />
        ) : (
          <SignUp onToggleMode={() => setMode("signin")} />
        )}
      </div>
    </div>
  );
}
