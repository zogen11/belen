import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Settings, Camera, Video, Clock, Heart, Eye, DollarSign, Save, X, Plus, Instagram, Youtube, Globe, ExternalLink, History, Bookmark, TrendingUp, Download, ChevronRight, Play, ThumbsUp, HelpCircle, MessageSquare, Info, Shield, Bell, Palette, Monitor, Trash2, Key, Users } from "lucide-react";
import { SiTiktok, SiFacebook, SiLinkedin, SiX } from "react-icons/si";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ComponentType<any>;
}

export default function Profile() {
  const { user } = useAuth();
  const currentUserId = user?.id || "default-user";
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [username, setUsername] = useState("Your Channel");
  const [bio, setBio] = useState("Content creator sharing amazing videos, shorts, and photos!");
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    { platform: "Instagram", url: "", icon: Instagram },
    { platform: "TikTok", url: "", icon: SiTiktok },
    { platform: "YouTube", url: "", icon: Youtube },
  ]);
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real content data
  const { data: videos = [], isLoading: videosLoading } = useQuery({
    queryKey: ['/api/videos'],
  });

  const { data: shorts = [], isLoading: shortsLoading } = useQuery({
    queryKey: ['/api/shorts'],
  });

  const { data: photos = [], isLoading: photosLoading } = useQuery({
    queryKey: ['/api/photos'],
  });

  // Filter content for current user
  const userVideos = (videos as any[]).filter((video: any) => video.userId === currentUserId);
  const userShorts = (shorts as any[]).filter((short: any) => short.userId === currentUserId);
  const userPhotos = (photos as any[]).filter((photo: any) => photo.userId === currentUserId);

  // Calculate real stats
  const totalViews = [...userVideos, ...userShorts].reduce((sum: number, item: any) => sum + (item.views || 0), 0);
  const totalLikes = userPhotos.reduce((sum: number, photo: any) => sum + (photo.likes || 0), 0);
  const totalEarnings = [...userVideos, ...userShorts, ...userPhotos].reduce((sum: number, item: any) => sum + (item.earnings || 0), 0);

  // User data (merged with auth user)
  const userData = {
    id: currentUserId,
    username: user?.username || username,
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    followers: user?.followers || 1250,
    following: user?.following || 89,
    totalEarnings: user?.totalEarnings || totalEarnings,
    profileImageUrl: user?.profileImageUrl || profileImage,
    bio: bio,
    joinDate: "August 2025",
  };

  const stats = {
    totalVideos: userVideos.length,
    totalShorts: userShorts.length,
    totalPhotos: userPhotos.length,
    totalViews: totalViews,
    totalLikes: totalLikes,
    totalContent: userVideos.length + userShorts.length + userPhotos.length,
    totalPhotoLikes: totalLikes,
  };

  // Profile update mutation
  const profileMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/auth/profile', 'PATCH', data),
    onSuccess: () => {
      toast({
        title: "Profile updated successfully!",
        description: "Your changes have been saved.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
    onError: () => {
      toast({
        title: "Error updating profile",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  // Handle profile photo upload
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profileImage', file);
      
      try {
        const response = await fetch('/api/auth/profile/photo', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.profileImageUrl) {
          setProfileImage(data.profileImageUrl);
          
          // Update user data in auth context immediately
          queryClient.setQueryData(['/api/auth/me'], (oldData: any) => {
            if (oldData?.user) {
              return {
                ...oldData,
                user: {
                  ...oldData.user,
                  profileImageUrl: data.profileImageUrl
                }
              };
            }
            return oldData;
          });
          
          toast({
            title: "Profile photo updated!",
            description: "Your new profile photo has been saved.",
          });
          
          // Also invalidate to get fresh data from server
          queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
        }
      } catch (error) {
        toast({
          title: "Error uploading photo",
          description: "Please try again with a different image.",
          variant: "destructive",
        });
      }
    }
  };

  // Handle profile save
  const handleSaveProfile = () => {
    profileMutation.mutate({
      username,
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
    });
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto p-6">
          
          {/* YouTube-style Profile Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-6">
                {/* Profile Avatar */}
                <div className="relative">
                  {(userData.profileImageUrl || profileImage) ? (
                    <img 
                      src={profileImage || userData.profileImageUrl} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover"
                      data-testid="profile-avatar"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 rounded-full flex items-center justify-center" data-testid="profile-avatar-placeholder">
                      <span className="text-white text-2xl font-bold">
                        {(userData.username || 'U').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoUpload}
                    className="hidden"
                    data-testid="input-profile-photo"
                  />
                  <Button
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 p-0"
                    data-testid="button-change-photo"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1" data-testid="text-username">
                    {userData.username}
                  </h1>
                  <p className="text-gray-600 text-sm mb-2" data-testid="text-channel-handle">
                    @{userData.username?.toLowerCase().replace(/\s+/g, '')} • View channel
                  </p>
                  <div className="flex items-center gap-4 text-gray-600 text-sm">
                    <span data-testid="text-followers">{userData.followers.toLocaleString()} followers</span>
                    <span data-testid="text-content-count">{stats.totalContent} content</span>
                    <span data-testid="text-join-date">Joined {userData.joinDate}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    data-testid="button-switch-account"
                    onClick={() => {
                      toast({
                        title: "Switch Account",
                        description: "Log in to a different BeLen account",
                      });
                      // Sign out current user and redirect to login
                      window.location.href = '/login';
                    }}
                  >
                    Switch account
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    data-testid="button-settings"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    data-testid="button-incognito"
                    onClick={() => {
                      toast({
                        title: "Private Mode",
                        description: "Browse BeLen without saving your activity",
                      });
                      // Toggle private browsing mode
                      localStorage.setItem('incognito-mode', 'true');
                    }}
                  >
                    Turn on Private
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Watch History Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900" data-testid="text-history-title">History</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-blue-600" 
                  data-testid="button-view-all-history"
                  onClick={() => window.location.href = '/history'}
                >
                  View all
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Recent watch history items */}
                {[...userVideos, ...userShorts].slice(0, 4).map((item: any, index) => (
                  <div 
                    key={`history-${item.id}-${index}`} 
                    className="group cursor-pointer" 
                    data-testid={`card-history-${item.id}`}
                    onClick={() => {
                      if (item.videoUrl) {
                        window.location.href = `/watch/video/${item.id}`;
                      } else {
                        window.location.href = `/watch/shorts/${item.id}`;
                      }
                    }}
                  >
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                      <img 
                        src={item.thumbnailUrl || '/api/placeholder/300/180'} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        data-testid={`img-history-thumbnail-${item.id}`}
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded" data-testid={`text-duration-${item.id}`}>
                        {item.duration || '2:32'}
                      </div>
                    </div>
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1" data-testid={`text-history-title-${item.id}`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500" data-testid={`text-history-creator-${item.id}`}>
                      {item.channelName || 'BeLen Creator'}
                    </p>
                  </div>
                ))}
                {[...userVideos, ...userShorts].length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No watch history yet</p>
                    <p className="text-sm text-gray-400">Videos and shorts you watch will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Collections Section */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900" data-testid="text-collections-title">Collections</h2>
                <Button variant="ghost" size="sm" className="text-blue-600" data-testid="button-view-all-collections">
                  <Plus className="w-4 h-4 mr-1" />
                  View all
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Watch Later */}
                <div 
                  className="group cursor-pointer" 
                  data-testid="card-watch-later"
                  onClick={() => {
                    toast({
                      title: "Watch Later",
                      description: "Your saved content for later viewing",
                    });
                    // Navigate to watch later page
                    window.location.href = '/watch-later';
                  }}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-gray-100">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {userVideos.length > 0 && (
                          <img 
                            src={userVideos[0].thumbnailUrl} 
                            alt="Collection thumbnail"
                            className="w-full h-full object-cover rounded"
                            data-testid="img-watch-later-thumbnail"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 rounded flex items-center justify-center">
                          <div className="bg-black/60 rounded-full p-3">
                            <Clock className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded" data-testid="text-watch-later-count">
                          {Math.min(440, stats.totalContent)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1" data-testid="text-watch-later-title">Watch later</h3>
                  <p className="text-xs text-gray-500" data-testid="text-watch-later-privacy">Private</p>
                </div>

                {/* Liked Content */}
                <div 
                  className="group cursor-pointer" 
                  data-testid="card-liked-content"
                  onClick={() => {
                    toast({
                      title: "Liked Content",
                      description: `${stats.totalLikes} liked items in your collection`,
                    });
                    // Navigate to liked content page
                    window.location.href = '/liked';
                  }}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-red-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative">
                        {userPhotos.length > 0 && (
                          <img 
                            src={userPhotos[0].imageUrl} 
                            alt="Collection thumbnail"
                            className="w-full h-full object-cover rounded"
                            data-testid="img-liked-content-thumbnail"
                          />
                        )}
                        <div className="absolute inset-0 bg-red-400/40 rounded flex items-center justify-center">
                          <div className="bg-red-500/80 rounded-full p-3">
                            <ThumbsUp className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded" data-testid="text-liked-content-count">
                          {stats.totalLikes || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1" data-testid="text-liked-content-title">Liked content</h3>
                  <p className="text-xs text-gray-500" data-testid="text-liked-content-privacy">Private</p>
                </div>

                {/* Creator Analytics - Unique to BeLen */}
                <div 
                  className="group cursor-pointer" 
                  data-testid="card-creator-analytics"
                  onClick={() => {
                    toast({
                      title: "Creator Analytics",
                      description: `Total earnings: $${(userData.totalEarnings || 0 / 100).toFixed(2)} | ${stats.totalViews} views`,
                    });
                    // Navigate to analytics dashboard
                    window.location.href = '/analytics';
                  }}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-3 bg-green-50">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-green-500/80 rounded-full p-3">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded" data-testid="text-analytics-label">
                      Analytics
                    </div>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1" data-testid="text-creator-analytics-title">Creator Analytics</h3>
                  <p className="text-xs text-gray-500" data-testid="text-creator-analytics-feature">Private • BeLen Feature</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Menu */}
          <div className="space-y-2">
            {/* Your Content */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left p-4 h-auto"
              onClick={() => window.location.href = '/upload'}
              data-testid="button-your-content"
            >
              <Play className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">Your content</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Downloads - BeLen Feature */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left p-4 h-auto" 
              data-testid="button-downloads"
              onClick={() => {
                toast({
                  title: "Downloads",
                  description: "Manage your downloaded content for offline viewing",
                });
                // Navigate to downloads page
                window.location.href = '/downloads';
              }}
            >
              <Download className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">Downloads</div>
                <div className="text-sm text-gray-500">Offline content storage</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Earnings History - Unique to BeLen */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left p-4 h-auto"
              onClick={() => window.location.href = '/earnings'}
              data-testid="button-earnings-history"
            >
              <DollarSign className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">Earnings History</div>
                <div className="text-sm text-gray-500">Track your monetization</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Content Collections - BeLen Feature */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left p-4 h-auto" 
              data-testid="button-content-collections"
              onClick={() => {
                toast({
                  title: "Content Collections",
                  description: "Create and manage custom content collections",
                });
                // Navigate to collections page
                window.location.href = '/collections';
              }}
            >
              <Bookmark className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">Content Collections</div>
                <div className="text-sm text-gray-500">Organize your favorite content</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Creator Insights - Unique to BeLen */}
            <Button 
              variant="ghost" 
              className="w-full justify-start text-left p-4 h-auto" 
              data-testid="button-creator-insights"
              onClick={() => {
                toast({
                  title: "Creator Insights",
                  description: `View detailed analytics for ${stats.totalContent} pieces of content`,
                });
                // Navigate to insights dashboard
                window.location.href = '/insights';
              }}
            >
              <TrendingUp className="w-5 h-5 mr-3" />
              <div className="flex-1">
                <div className="font-medium">Creator Insights</div>
                <div className="text-sm text-gray-500">Detailed performance analytics</div>
              </div>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

        </div>
      </div>
      
      {/* Settings Modal */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Settings
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              
              {/* Account Settings */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Account Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Username</label>
                      <Input
                        value={userData.username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Your username"
                        data-testid="input-settings-username"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input
                        value={userData.email}
                        disabled
                        className="bg-gray-50"
                        data-testid="input-settings-email"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">First Name</label>
                      <Input
                        value={userData.firstName}
                        placeholder="First name"
                        data-testid="input-settings-firstname"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name</label>
                      <Input
                        value={userData.lastName}
                        placeholder="Last name"
                        data-testid="input-settings-lastname"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Privacy & Security */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Privacy & Security
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Change Password</p>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-change-password">
                      <Key className="w-4 h-4 mr-2" />
                      Change
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">Add extra security to your account</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-2fa">
                      Enable
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Privacy Settings</p>
                      <p className="text-sm text-gray-500">Control who can see your content and data</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-privacy">
                      Manage
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">Get updates about your content and earnings</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-email-notifications">
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Browser and mobile notifications</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-push-notifications">
                      Configure
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Appearance
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Theme</p>
                      <p className="text-sm text-gray-500">Choose light, dark, or system theme</p>
                    </div>
                    <Select defaultValue="system">
                      <SelectTrigger className="w-32" data-testid="select-theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Display Quality</p>
                      <p className="text-sm text-gray-500">Choose video quality preferences</p>
                    </div>
                    <Select defaultValue="auto">
                      <SelectTrigger className="w-32" data-testid="select-quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="1080p">1080p</SelectItem>
                        <SelectItem value="720p">720p</SelectItem>
                        <SelectItem value="480p">480p</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Advanced Tools */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Monitor className="w-4 h-4" />
                  Advanced Tools
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Creator Analytics</p>
                      <p className="text-sm text-gray-500">Advanced insights and revenue tracking</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-analytics"
                      onClick={() => window.location.href = '/analytics'}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Content Management</p>
                      <p className="text-sm text-gray-500">Batch edit, organize, and schedule content</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-content-management">
                      <Edit className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Data Export</p>
                      <p className="text-sm text-gray-500">Download your content, analytics, and earnings data</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-data-export">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">API Access</p>
                      <p className="text-sm text-gray-500">Generate API keys for third-party integrations</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-api-access">
                      <Key className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Help & Support */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" />
                  Help & Support
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Help Center</p>
                      <p className="text-sm text-gray-500">Find answers to common questions</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-help-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Visit
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Send Feedback</p>
                      <p className="text-sm text-gray-500">Report bugs or suggest improvements</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-send-feedback">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Contact Support</p>
                      <p className="text-sm text-gray-500">Get help from our support team</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-contact-support">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* About */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  About BeLen
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Version</p>
                      <p className="text-sm text-gray-500">BeLen Platform v2.1.0</p>
                    </div>
                    <Badge variant="secondary">Latest</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Terms of Service</p>
                      <p className="text-sm text-gray-500">Read our terms and conditions</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-terms">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Privacy Policy</p>
                      <p className="text-sm text-gray-500">How we handle your data</p>
                    </div>
                    <Button variant="outline" size="sm" data-testid="button-privacy-policy">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-600">Permanently delete your account and all data</p>
                    </div>
                    <Button variant="destructive" size="sm" data-testid="button-delete-account">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

            </div>
          </ScrollArea>
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setShowSettings(false)} data-testid="button-cancel-settings">
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} data-testid="button-save-settings">
              Save Changes
            </Button>
          </div>
          
        </DialogContent>
      </Dialog>
      
      <MobileNav />
    </div>
  );
}