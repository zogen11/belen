import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Settings, Camera, Video, Clock, Heart, Eye, DollarSign, Save, X, Plus, Instagram, Youtube, Globe, ExternalLink } from "lucide-react";
import { SiTiktok, SiFacebook, SiLinkedin, SiX } from "react-icons/si";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import VideoCard from "@/components/content/video-card";
import ShortsCard from "@/components/content/shorts-card";
import PhotoCard from "@/components/content/photo-card";

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

  // Profile photo upload
  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', currentUserId);
    formData.append('title', 'Profile Photo');
    formData.append('description', 'Profile photo');
    formData.append('isMonetized', 'false');

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const photo = await response.json();
        setProfileImage(photo.imageUrl);
        
        // Update user profile with new photo URL
        profileUpdateMutation.mutate({
          profileImageUrl: photo.imageUrl
        });
        
        toast({
          title: "Success",
          description: "Profile photo updated and saved to database!",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload profile photo",
        variant: "destructive",
      });
    }
  };

  // Profile update mutation
  const profileUpdateMutation = useMutation({
    mutationFn: async (updates: any) => {
      return await apiRequest('/api/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully and saved to database!",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  });

  // Save profile changes
  const handleSaveProfile = () => {
    const updates = {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: username,
      profileImageUrl: profileImage || user?.profileImageUrl,
    };
    
    profileUpdateMutation.mutate(updates);
  };

  // Add social media link
  const handleAddSocialLink = () => {
    if (newSocialPlatform && newSocialUrl) {
      const platformIcons: Record<string, React.ComponentType<any>> = {
        Instagram: Instagram,
        TikTok: SiTiktok,
        YouTube: Youtube,
        Twitter: SiX,
        Facebook: SiFacebook,
        LinkedIn: SiLinkedin,
        Website: Globe,
      };
      
      setSocialLinks([...socialLinks, {
        platform: newSocialPlatform,
        url: newSocialUrl,
        icon: platformIcons[newSocialPlatform] || Globe
      }]);
      setNewSocialPlatform("");
      setNewSocialUrl("");
    }
  };

  // Remove social link
  const handleRemoveSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  // Update social link URL
  const handleUpdateSocialLink = (index: number, url: string) => {
    const updated = [...socialLinks];
    updated[index].url = url;
    setSocialLinks(updated);
  };

  const stats = {
    totalVideos: userVideos.length,
    totalShorts: userShorts.length,
    totalPhotos: userPhotos.length,
    totalViews: totalViews,
    totalLikes: totalLikes,
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-4xl font-bold">
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
                />
                <Button
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="text-3xl font-bold text-gray-900 mb-2 border-0 shadow-none p-0 bg-transparent"
                        placeholder="Channel name"
                      />
                    ) : (
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {userData.username}
                      </h1>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                      <span>{userData.followers.toLocaleString()} followers</span>
                      <span>{userData.following.toLocaleString()} following</span>
                      <span>Joined {userData.joinDate}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    {isEditing ? (
                      <>
                        <Button onClick={handleSaveProfile} size="sm">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-4">
                  {isEditing ? (
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell your audience about your channel..."
                      className="max-w-2xl"
                      rows={3}
                    />
                  ) : (
                    <p className="text-gray-700 max-w-2xl">{user.bio}</p>
                  )}
                </div>

                {/* Social Links */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Social Media</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {socialLinks.map((link, index) => {
                      const IconComponent = link.icon;
                      return (
                        <div key={index} className="flex items-center gap-2">
                          {isEditing ? (
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                              <IconComponent className="w-4 h-4" />
                              <Input
                                value={link.url}
                                onChange={(e) => handleUpdateSocialLink(index, e.target.value)}
                                placeholder={`${link.platform} URL`}
                                className="w-40 h-8"
                              />
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleRemoveSocialLink(index)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          ) : link.url ? (
                            <a 
                              href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-1 transition-colors"
                            >
                              <IconComponent className="w-4 h-4" />
                              <span className="text-sm">{link.platform}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : null}
                        </div>
                      );
                    })}
                    
                    {isEditing && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-1" />
                            Add Link
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Social Media Link</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Select value={newSocialPlatform} onValueChange={setNewSocialPlatform}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select platform" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Instagram">Instagram</SelectItem>
                                <SelectItem value="TikTok">TikTok</SelectItem>
                                <SelectItem value="YouTube">YouTube</SelectItem>
                                <SelectItem value="Twitter">Twitter</SelectItem>
                                <SelectItem value="Facebook">Facebook</SelectItem>
                                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                                <SelectItem value="Website">Website</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              value={newSocialUrl}
                              onChange={(e) => setNewSocialUrl(e.target.value)}
                              placeholder="Enter URL"
                            />
                            <Button onClick={handleAddSocialLink} className="w-full">
                              Add Link
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {formatEarnings(user.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalViews.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Views</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalLikes.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalVideos + stats.totalShorts}
                    </p>
                    <p className="text-sm text-gray-600">Videos</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalPhotos}
                    </p>
                    <p className="text-sm text-gray-600">Photos</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="all">All Content</TabsTrigger>
            <TabsTrigger value="videos">
              <Video className="w-4 h-4 mr-2" />
              Videos ({stats.totalVideos})
            </TabsTrigger>
            <TabsTrigger value="shorts">
              <Clock className="w-4 h-4 mr-2" />
              Shorts ({stats.totalShorts})
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Camera className="w-4 h-4 mr-2" />
              Photos ({stats.totalPhotos})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userVideos.map((video: any) => (
                <div key={`video-${video.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-red-600 text-white">VIDEO</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{video.views.toLocaleString()} views</span>
                      <span className="text-green-600">{formatEarnings(video.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {userShorts.map((short: any) => (
                <div key={`short-${short.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-[9/16] max-h-60">
                    <video src={short.videoUrl} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-purple-600 text-white">SHORT</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{short.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{short.views.toLocaleString()} views</span>
                      <span className="text-green-600">{formatEarnings(short.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {userPhotos.map((photo: any) => (
                <div key={`photo-${photo.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-blue-600 text-white">PHOTO</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{photo.likes.toLocaleString()} likes</span>
                      <span className="text-green-600">{formatEarnings(photo.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {(userVideos.length === 0 && userShorts.length === 0 && userPhotos.length === 0) && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No content uploaded yet. Start creating!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {userVideos.map((video: any) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <video src={video.videoUrl} className="w-full h-full object-cover" controls />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{video.views.toLocaleString()} views</span>
                      <span className="text-green-600">{formatEarnings(video.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {userVideos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No videos uploaded yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="shorts">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {userShorts.map((short: any) => (
                <div key={short.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-[9/16]">
                    <video src={short.videoUrl} className="w-full h-full object-cover" controls />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{short.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{short.views.toLocaleString()} views</span>
                      <span className="text-green-600">{formatEarnings(short.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {userShorts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No shorts uploaded yet.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {userPhotos.map((photo: any) => (
                <div key={photo.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{photo.likes.toLocaleString()} likes</span>
                      <span className="text-green-600">{formatEarnings(photo.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              {userPhotos.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No photos uploaded yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
}
