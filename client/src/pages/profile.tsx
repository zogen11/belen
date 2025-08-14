import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Edit, Settings, Camera, Video, Clock, Heart, Eye, DollarSign } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import VideoCard from "@/components/content/video-card";
import ShortsCard from "@/components/content/shorts-card";
import PhotoCard from "@/components/content/photo-card";

export default function Profile() {
  const currentUserId = "default-user"; // TODO: Get from auth

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
  const userVideos = videos.filter((video: any) => video.userId === currentUserId);
  const userShorts = shorts.filter((short: any) => short.userId === currentUserId);
  const userPhotos = photos.filter((photo: any) => photo.userId === currentUserId);

  // Calculate real stats
  const totalViews = [...userVideos, ...userShorts].reduce((sum: number, item: any) => sum + (item.views || 0), 0);
  const totalLikes = userPhotos.reduce((sum: number, photo: any) => sum + (photo.likes || 0), 0);
  const totalEarnings = [...userVideos, ...userShorts, ...userPhotos].reduce((sum: number, item: any) => sum + (item.earnings || 0), 0);

  // User data
  const user = {
    id: currentUserId,
    username: "Your Profile",
    followers: 1250,
    following: 89,
    totalEarnings: totalEarnings,
    bio: "Content creator sharing amazing videos, shorts, and photos!",
    joinDate: "August 2025",
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {user.username.charAt(0)}
                  </span>
                </div>
                <Button
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.username}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                      <span>{user.followers.toLocaleString()} followers</span>
                      <span>{user.following.toLocaleString()} following</span>
                      <span>Joined {user.joinDate}</span>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 max-w-2xl">{user.bio}</p>

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
