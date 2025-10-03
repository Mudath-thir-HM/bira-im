"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "signin" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [classLevel, setClassLevel] = useState<"JSS1" | "JSS2" | "JSS3">(
    "JSS1"
  );
  const { login } = useUser();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === "signup") {
        if (password !== confirmPassword) {
          setError("Passwords don't match!");
          return;
        }
        // In a real app, you'd register the user here.
        await login(email, classLevel);
        router.push("/homepage");
      } else {
        // In a real app, you'd authenticate the user here.
        await login(email, "JSS1"); // Class level would be fetched for existing user
        router.push("/homepage");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during authentication"
      );
    }
  };

  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === "signin" ? "signup" : "signin"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-brand-text-primary mb-6">
          {mode === "signin" ? "Welcome Back!" : "Create Your Account"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          <div>
            <label
              className="block text-sm font-medium text-brand-text-secondary"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-brand-text-secondary"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
            />
          </div>
          {mode === "signup" && (
            <>
              <div>
                <label
                  className="block text-sm font-medium text-brand-text-secondary"
                  htmlFor="confirmPassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-brand-text-secondary"
                  htmlFor="classLevel"
                >
                  Class
                </label>
                <select
                  id="classLevel"
                  value={classLevel}
                  onChange={(e) =>
                    setClassLevel(e.target.value as "JSS1" | "JSS2" | "JSS3")
                  }
                  required
                  className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
                >
                  <option>JSS1</option>
                  <option>JSS2</option>
                  <option>JSS3</option>
                </select>
              </div>
            </>
          )}
          <Button type="submit" className="w-full">
            {mode === "signin" ? "Sign In" : "Sign Up"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm">
          {mode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={toggleMode}
            className="font-medium text-brand-secondary hover:underline ml-1"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;
