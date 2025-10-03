// src/app/auth/page.tsx
"use client";

import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthMode = "signin" | "signup";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [classLevel, setClassLevel] = useState<"JSS1" | "JSS2" | "JSS3">(
    "JSS1"
  );
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (mode === "signup") {
        // Validate passwords match
        if (password !== confirmPassword) {
          setError("Passwords don't match!");
          setIsLoading(false);
          return;
        }

        // Create account
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name: name || email.split("@")[0],
            classLevel,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to create account");
          setIsLoading(false);
          return;
        }

        // Show success message
        setSuccess(data.message);
        setIsLoading(false);

        // Clear form
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");

        // Switch to signin mode after 3 seconds
        setTimeout(() => {
          setMode("signin");
          setSuccess(null);
        }, 3000);
      } else {
        // Sign in
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Invalid email or password");
          setIsLoading(false);
          return;
        }

        // Redirect to homepage on success
        router.push("/homepage");
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setError(null);
    setSuccess(null);
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

          {success && (
            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {success}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label
                className="block text-sm font-medium text-brand-text-secondary"
                htmlFor="name"
              >
                Name (Optional)
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                placeholder="Your name"
                className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary disabled:opacity-50"
              />
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
              disabled={isLoading}
              className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary disabled:opacity-50"
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
              disabled={isLoading}
              minLength={6}
              className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary disabled:opacity-50"
            />
            {mode === "signup" && (
              <p className="text-xs text-brand-text-secondary mt-1">
                Must be at least 6 characters
              </p>
            )}
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
                  disabled={isLoading}
                  className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary disabled:opacity-50"
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
                  disabled={isLoading}
                  className="mt-1 block w-full px-3 py-2 bg-brand-background border border-brand-primary rounded-md shadow-sm focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary disabled:opacity-50"
                >
                  <option>JSS1</option>
                  <option>JSS2</option>
                  <option>JSS3</option>
                </select>
              </div>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? "Loading..."
              : mode === "signin"
              ? "Sign In"
              : "Sign Up"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm">
          {mode === "signin"
            ? "Don't have an account?"
            : "Already have an account?"}
          <button
            onClick={toggleMode}
            disabled={isLoading}
            className="font-medium text-brand-secondary hover:underline ml-1 disabled:opacity-50"
          >
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;
