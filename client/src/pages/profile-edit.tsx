import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowLeft, LogOut, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  email: string;
  totalEarnings: number;
  followers: number;
  following: number;
  description?: string;
  isPrivate?: boolean;
  allowComments?: boolean;
}

export default function ProfileEdit() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Get current user profile
  const { data: user, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/auth/me"],
  });

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    email: user?.email || '',
    description: user?.description || '',
    isPrivate: user?.isPrivate || false,
    allowComments: user?.allowComments !== false
  });



  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.clear();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      console.log("Starting profile photo upload...");
      
      // Debug session before upload
      const sessionResponse = await fetch("/api/auth/session-debug", {
        credentials: "include",
      });
      const sessionData = await sessionResponse.json();
      console.log("Session debug data:", sessionData);
      
      const formData = new FormData();
      formData.append("profileImage", file);
      
      const response = await fetch("/api/auth/profile/photo", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Upload failed with status:", response.status, errorText);
        throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile photo updated",
        description: "Your profile photo has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadingImage(true);
      uploadImageMutation.mutate(file, {
        onSettled: () => setUploadingImage(false),
      });
    }
  };

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('PUT', '/api/auth/update-profile', data);
      
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  const handleCopyUrl = () => {
    const channelUrl = `${window.location.origin}/profile/${user?.username}`;
    navigator.clipboard.writeText(channelUrl);
    setCopiedUrl(true);
    toast({
      title: "URL copied",
      description: "Channel URL copied to clipboard",
    });
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Please log in to edit your profile</p>
          <Button onClick={() => navigate("/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* YouTube-style Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-medium text-gray-900">Channel settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* YouTube-style Banner Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
          {/* Banner Background - Exactly like YouTube */}
          <div className="relative h-48 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-3xl font-medium">{user.firstName} {user.lastName}</h2>
              <p className="text-blue-100 text-sm mt-1">Just in time for the family reunion!</p>
            </div>
            
            {/* Banner Edit Button */}
            <div className="absolute top-4 right-4">
              <Button 
                variant="secondary" 
                size="icon" 
                className="bg-black/20 hover:bg-black/30 border-0 text-white"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Profile Picture - Overlapping banner */}
            <div className="absolute -bottom-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.username} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </span>
                    </div>
                  )}
                </div>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                >
                  <Camera className="h-3 w-3" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="pt-16 px-6 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                <p className="text-gray-600 text-sm">@{user.username}</p>
                <p className="text-gray-600 text-sm">{user.followers?.toLocaleString()} followers • {user.following} following</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Menu - Clean Modern Style */}
        <div className="space-y-4">
          {/* Privacy & Security */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Privacy & Security", description: "Coming soon" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Privacy & Security</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your privacy settings and account security</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Caption Settings */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Caption Settings", description: "Configure caption preferences" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Caption</h3>
                <p className="text-sm text-gray-600 mt-1">Subtitle and caption preferences</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Accessibility */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Accessibility", description: "Accessibility options coming soon" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Accessibility</h3>
                <p className="text-sm text-gray-600 mt-1">Screen reader and accessibility options</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Live Chat Watch on TV */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Live Chat Watch on TV", description: "TV viewing options coming soon" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Live Chat Watch on TV</h3>
                <p className="text-sm text-gray-600 mt-1">Configure TV viewing and live chat settings</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Purchase and Membership */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Purchase and Membership", description: "Manage your subscriptions and purchases" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Purchase and Membership</h3>
                <p className="text-sm text-gray-600 mt-1">Subscriptions, purchases, and premium features</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Billing and Payment */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Billing and Payment", description: "Manage payment methods and billing" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Billing and Payment</h3>
                <p className="text-sm text-gray-600 mt-1">Payment methods, invoices, and billing history</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Your Data in BeLen */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "Your Data in BeLen", description: "Manage your data and downloads" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">Your Data in BeLen</h3>
                <p className="text-sm text-gray-600 mt-1">Download your data, manage data usage</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* General */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "General Settings", description: "General app preferences" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">General</h3>
                <p className="text-sm text-gray-600 mt-1">Language, region, and general preferences</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* BeLen Terms of Service */}
          <div className="bg-white rounded-lg shadow-sm">
            <Button
              variant="ghost"
              className="w-full justify-between p-6 h-auto text-left hover:bg-gray-50"
              onClick={() => toast({ title: "BeLen Terms of Service", description: "View terms and policies" })}
            >
              <div>
                <h3 className="text-base font-medium text-gray-900">BeLen Terms of Service</h3>
                <p className="text-sm text-gray-600 mt-1">Privacy policy, terms of use, and community guidelines</p>
              </div>
              <div className="text-gray-400">›</div>
            </Button>
          </div>

          {/* Account Management Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Management</h3>
            <div className="space-y-4">
              {/* Logout Button */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">Log out</Label>
                  <p className="text-sm text-gray-600">Sign out of your BeLen account</p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                  className="flex items-center gap-2"
                  data-testid="button-logout"
                >
                  <LogOut className="h-4 w-4" />
                  {logoutMutation.isPending ? "Logging out..." : "Log out"}
                </Button>
              </div>

              {/* Delete Account Button */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-red-600">Delete account</Label>
                  <p className="text-sm text-gray-600">Permanently remove your BeLen account</p>
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  className="flex items-center gap-2"
                  data-testid="button-delete-account"
                  onClick={() => {
                    toast({
                      title: "Account deletion",
                      description: "Account deletion functionality will be available soon.",
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}