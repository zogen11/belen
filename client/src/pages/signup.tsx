import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { signupSchema, type SignupData } from "@shared/schema";
import { User, Home, Play } from "lucide-react";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      phone: "",
      username: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Signup failed");
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      // Set the user data directly in the cache
      queryClient.setQueryData(['/api/auth/me'], data);
      
      toast({
        title: "Welcome to BeLen!",
        description: "Your account has been created successfully.",
      });
      
      // Navigate to home immediately
      setLocation("/");
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupData) => {
    signupMutation.mutate(data);
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
        <Link href="/login" className="text-sm text-blue-600 hover:text-blue-700 font-medium" data-testid="link-login">
          <User className="w-4 h-4 inline mr-1" />
          Sign in
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm">
          {/* Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-32 bg-green-200 dark:bg-green-800 rounded-t-full mx-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-green-300 to-green-200 dark:from-green-700 dark:to-green-800"></div>
                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-green-400 dark:bg-green-600 rounded-full"></div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-pink-300 rounded transform rotate-45"></div>
              <div className="absolute top-2 -right-3 w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
              <div className="absolute top-6 -left-1 w-1.5 h-1.5 bg-purple-300 rounded-full"></div>
              <div className="absolute top-8 right-4 w-1 h-1 bg-yellow-300 rounded-full"></div>
            </div>
          </div>

          {/* Text */}
          <h1 className="text-xl font-normal text-gray-900 dark:text-white mb-2 text-center">
            Create your BeLen account
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-center text-sm">
            Join the creator community and start sharing your content
          </p>

          {/* Form */}
          <div className="space-y-3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="First name"
                            type="text"
                            className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Last name"
                            type="text"
                            className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Email address"
                          type="email"
                          autoComplete="email"
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Username"
                          type="text"
                          autoComplete="username"
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-username"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Phone number (optional)"
                          type="tel"
                          autoComplete="tel"
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-phone"
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
                          autoComplete="new-password"
                          className="h-11 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-lg"
                          data-testid="input-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors mt-4"
                  disabled={signupMutation.isPending}
                  data-testid="button-signup"
                >
                  {signupMutation.isPending ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-around py-2">
          <button 
            onClick={() => {
              toast({
                title: "Sign up required",
                description: "Please create an account to access Home",
                variant: "destructive"
              });
            }}
            className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            data-testid="nav-home"
          >
            <Home className="w-6 h-6 mb-1" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => {
              toast({
                title: "Sign up required", 
                description: "Please create an account to access Shorts",
                variant: "destructive"
              });
            }}
            className="flex flex-col items-center py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            data-testid="nav-shorts"
          >
            <Play className="w-6 h-6 mb-1" />
            <span className="text-xs">Shorts</span>
          </button>
          <button className="flex flex-col items-center py-2 text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400">
            <User className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">You</span>
          </button>
        </div>
      </div>
    </div>
  );
}