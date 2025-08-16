import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, ArrowLeft, Copy, Check, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

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

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    description: "",
    isPrivate: false,
    allowComments: true,
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        username: user.username || "",
        description: user.description || "",
        isPrivate: user.isPrivate || false,
        allowComments: user.allowComments !== false,
      });
    }
  }, [user]);

  // Profile update mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
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

        {/* YouTube-style Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Name Field - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Name</Label>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={`${formData.firstName} ${formData.lastName}`}
                onChange={(e) => {
                  const names = e.target.value.split(' ');
                  setFormData(prev => ({ 
                    ...prev, 
                    firstName: names[0] || '', 
                    lastName: names.slice(1).join(' ') || '' 
                  }));
                }}
                className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Handle Field - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Handle</Label>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <Input
                value={`@${formData.username}`}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value.replace('@', '') }))}
                className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Channel URL Field - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Channel URL</Label>
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={handleCopyUrl}
                >
                  {copiedUrl ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
              <Input
                value={`https://www.belen.com/@${user.username}`}
                readOnly
                className="text-base border-gray-300 bg-gray-50 text-gray-600"
                data-testid="input-channel-url"
              />
            </div>

            {/* Description Field - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium text-gray-900">Description</Label>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Edit3 className="h-3 w-3" />
                </Button>
              </div>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe here"
                className="text-base border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[80px] resize-none"
                maxLength={1000}
              />
            </div>

            {/* My Community Toggle - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">My Community</Label>
                  <p className="text-sm text-gray-600">Viewers can post</p>
                </div>
                <Switch
                  checked={formData.allowComments}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, allowComments: checked }))}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </div>

            {/* Privacy Toggle - YouTube Style */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium text-gray-900">Privacy</Label>
                  <p className="text-sm text-gray-600">Keep all my subscriptions private</p>
                </div>
                <Switch
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPrivate: checked }))}
                  className="data-[state=checked]:bg-gray-900"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="border-t pt-6 flex justify-end">
              <Button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>

            {/* Notice Text - YouTube Style */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">ℹ</span>
                Changes made to your name and profile picture are visible only on BeLen and not other Google services.
                <span className="text-blue-500 underline cursor-pointer">Learn more</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}