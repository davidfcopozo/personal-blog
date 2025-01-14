"use client";

import BouncingCirclesLoader from "@/components/bouncing-squares-loader";
import { LoginForm } from "@/components/login-form";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { isLoading } = useAuth();
  return (
    <div className="flex items-center justify-center mt-16 text-foreground min-h-screen">
      {isLoading && <BouncingCirclesLoader />}
      <LoginForm />
    </div>
  );
};

export default Login;
