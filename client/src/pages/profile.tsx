import { useState } from "react";
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
  // Mock user data
  const mockUser = {
    id: "1",
    username: "CreativeUser",
    followers: 245000,
    following: 1250,
    totalEarnings: 324785, // in cents
    bio: "Digital creator passionate about travel, photography, and storytelling. Join me on my adventures!",
    joinDate: "March 2023",
  };

  const mockStats = {
    totalVideos: 45,
    totalShorts: 23,
    totalPhotos: 78,
    totalViews: 1247892,
    totalLikes: 98432,
  };

  // Mock content data
  const mockVideos = [
    {
      id: "1",
      title: "Amazing Mountain Adventure",
      thumbnailUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      views: 45230,
      earnings: 4523,
      duration: 900,
    },
    {
      id: "2", 
      title: "Urban Photography Tips",
      thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      views: 23450,
      earnings: 2345,
      duration: 525,
    },
  ];

  const mockShorts = [
    {
      id: "1",
      title: "Quick Dance Tutorial",
      thumbnailUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
      views: 126700,
      earnings: 12670,
      duration: 45,
    },
  ];

  const mockPhotos = [
    {
      id: "1",
      title: "Sunset Mountain View",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      likes: 15200,
      earnings: 7600,
    },
    {
      id: "2",
      title: "City Street Photography", 
      imageUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
      likes: 9800,
      earnings: 4900,
    },
  ];

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
                <div className="w-32 h-32 bg-gradient-to-br from-belen-orange to-belen-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    {mockUser.username.charAt(0)}
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
                      {mockUser.username}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                      <span>{mockUser.followers.toLocaleString()} followers</span>
                      <span>{mockUser.following.toLocaleString()} following</span>
                      <span>Joined {mockUser.joinDate}</span>
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

                <p className="text-gray-700 mb-4 max-w-2xl">{mockUser.bio}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-belen-green">
                      {formatEarnings(mockUser.totalEarnings)}
                    </p>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockStats.totalViews.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Views</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockStats.totalLikes.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockStats.totalVideos + mockStats.totalShorts}
                    </p>
                    <p className="text-sm text-gray-600">Videos</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-900">
                      {mockStats.totalPhotos}
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
              Videos ({mockStats.totalVideos})
            </TabsTrigger>
            <TabsTrigger value="shorts">
              <Clock className="w-4 h-4 mr-2" />
              Shorts ({mockStats.totalShorts})
            </TabsTrigger>
            <TabsTrigger value="photos">
              <Camera className="w-4 h-4 mr-2" />
              Photos ({mockStats.totalPhotos})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {/* Mock mixed content */}
              {mockVideos.map((video) => (
                <div key={`video-${video.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-red-600 text-white">VIDEO</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{video.views.toLocaleString()} views</span>
                      <span className="text-belen-green">{formatEarnings(video.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {mockShorts.map((short) => (
                <div key={`short-${short.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-[9/16] max-h-60">
                    <img src={short.thumbnailUrl} alt={short.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-purple-600 text-white">SHORT</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{short.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{short.views.toLocaleString()} views</span>
                      <span className="text-belen-green">{formatEarnings(short.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}

              {mockPhotos.map((photo) => (
                <div key={`photo-${photo.id}`} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                    <Badge className="absolute top-2 left-2 bg-belen-blue text-white">PHOTO</Badge>
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{photo.likes.toLocaleString()} likes</span>
                      <span className="text-belen-green">{formatEarnings(photo.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {mockVideos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-video">
                    <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{video.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{video.views.toLocaleString()} views</span>
                      <span className="text-belen-green">{formatEarnings(video.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="shorts">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {mockShorts.map((short) => (
                <div key={short.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-[9/16]">
                    <img src={short.thumbnailUrl} alt={short.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{short.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{short.views.toLocaleString()} views</span>
                      <span className="text-belen-green">{formatEarnings(short.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="photos">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {mockPhotos.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="relative aspect-square">
                    <img src={photo.imageUrl} alt={photo.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm mb-1">{photo.title}</h3>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{photo.likes.toLocaleString()} likes</span>
                      <span className="text-belen-green">{formatEarnings(photo.earnings)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <MobileNav />
    </div>
  );
}
