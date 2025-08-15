import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loginSchema, type LoginData } from "@shared/schema";
import { User } from "lucide-react";

export default function LoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Login failed");
      }
      
      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      });
      // Invalidate and refetch auth query to refresh user state immediately
      await queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      await queryClient.refetchQueries({ queryKey: ['/api/auth/me'] });
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">BeLen</span>
        </div>
        <Link href="/signup" className="text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="link-signup">
          <User className="w-4 h-4 inline mr-1" />
          Sign up
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          {/* Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-40 bg-blue-200 dark:bg-blue-800 rounded-t-full mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-300 to-blue-200 dark:from-blue-700 dark:to-blue-800"></div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-pink-300 rounded transform rotate-45"></div>
              <div className="absolute top-4 -right-4 w-2 h-2 bg-blue-300 rounded-full"></div>
              <div className="absolute top-8 -left-2 w-2 h-2 bg-purple-300 rounded-full"></div>
              <div className="absolute -top-1 -left-4 w-1.5 h-1.5 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-12 right-6 w-1.5 h-1.5 bg-green-300 rounded-full"></div>
              <div className="absolute bottom-16 -right-6 w-2 h-2 bg-red-300 rounded transform rotate-45"></div>
              <div className="absolute bottom-20 -left-3 w-1.5 h-1.5 bg-indigo-300 rounded-full"></div>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-2xl font-normal text-gray-900 dark:text-white mb-2">
            You're not signed in
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Sign in now to upload, save, and comment on videos
          </p>

          {/* Form */}
          <div className="space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="emailOrPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email or phone number"
                          type="text"
                          autoComplete="username"
                          className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-email-phone"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Password"
                          type="password"
                          autoComplete="current-password"
                          className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors"
                  disabled={loginMutation.isPending}
                  data-testid="button-login"
                >
                  {loginMutation.isPending ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          <button className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400">
            <div className="w-6 h-6 mb-1">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 6v12h2V6h-2zM13 6v12h2V6h-2zM8 6v12h2V6H8zM3 6v12h2V6H3z"/>
              </svg>
            </div>
            <span className="text-xs">Shorts</span>
          </button>
          <button className="flex flex-col items-center py-2 text-gray-900 dark:text-white border-b-2 border-gray-900 dark:border-white">
            <div className="w-6 h-6 mb-1">
              <User size={24} />
            </div>
            <span className="text-xs font-medium">You</span>
          </button>
        </div>
      </div>
    </div>
  );
}