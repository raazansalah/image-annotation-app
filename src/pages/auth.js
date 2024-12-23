// pages/index.js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { login, handleSignup } from "../../auth";

import useAuth from "@/hooks/auth";
import Input from "@/components/Input";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const router = useRouter();
  const user = useAuth();

  const handleAuthAction = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await login(email, password);
        alert("Login Successful");
        setEmail("");
        setPassword("");
        router.push({
          pathname: "/home",
          query: { userId: result.user.uid },
        });
      } else {
        await handleSignup(email, password);
        alert("Sign Up Successful");
        setEmail("");
        setPassword("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!user)
      router.push({
        pathname: "/auth",
      });
  }, [user]);

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {isLogin ? "Login" : "Sign Up"}
      </h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Toggle buttons */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsLogin(true)}
          className={`px-4 py-2 mx-2 border-2 rounded-lg transition-all ${
            isLogin
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-200 text-gray-700 border-gray-300"
          } hover:bg-blue-600 hover:border-blue-600`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`px-4 py-2 mx-2 border-2 rounded-lg transition-all ${
            !isLogin
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-200 text-gray-700 border-gray-300"
          } hover:bg-blue-600 hover:border-blue-600`}
        >
          Sign Up
        </button>
      </div>

      <form onSubmit={handleAuthAction} className="space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />

        <button
          type="submit"
          className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg transition-all hover:bg-blue-600"
        >
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
