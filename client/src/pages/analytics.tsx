import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, Eye, DollarSign, Heart, Calendar, BarChart3 } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

export default function Analytics() {
  const { user } = useAuth();
  
  const { data: videos = [] } = useQuery({
    queryKey: ['/api/videos'],
  });

  const { data: shorts = [] } = useQuery({
    queryKey: ['/api/shorts'],
  });

  const { data: photos = [] } = useQuery({
    queryKey: ['/api/photos'],
  });

  // Filter user's content
  const userVideos = (videos as any[]).filter((video: any) => video.userId === user?.id);
  const userShorts = (shorts as any[]).filter((short: any) => short.userId === user?.id);
  const userPhotos = (photos as any[]).filter((photo: any) => photo.userId === user?.id);

  // Calculate analytics
  const analytics = {
    totalViews: [...userVideos, ...userShorts].reduce((sum: number, item: any) => sum + (item.views || 0), 0),
    totalLikes: userPhotos.reduce((sum: number, photo: any) => sum + (photo.likes || 0), 0),
    totalEarnings: [...userVideos, ...userShorts, ...userPhotos].reduce((sum: number, item: any) => sum + (item.earnings || 0), 0),
    totalContent: userVideos.length + userShorts.length + userPhotos.length,
    avgViewsPerVideo: userVideos.length > 0 ? Math.round(userVideos.reduce((sum: number, video: any) => sum + (video.views || 0), 0) / userVideos.length) : 0,
    topPerformingContent: [...userVideos, ...userShorts].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5)
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto p-6">
          
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-analytics-title">Creator Analytics</h1>
              <p className="text-gray-600" data-testid="text-analytics-description">Track your content performance and earnings</p>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" data-testid="text-total-views">
                      {analytics.totalViews.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" data-testid="text-total-earnings">
                      {formatEarnings(analytics.totalEarnings)}
                    </h3>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <Heart className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" data-testid="text-total-likes">
                      {analytics.totalLikes.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600">Total Likes</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900" data-testid="text-avg-views">
                      {analytics.avgViewsPerVideo.toLocaleString()}
                    </h3>
                    <p className="text-sm text-gray-600">Avg Views/Video</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Top Content</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-performance-overview">Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Total Content Pieces</span>
                      <Badge variant="secondary" data-testid="text-total-content">{analytics.totalContent}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Videos Published</span>
                      <Badge variant="secondary" data-testid="text-videos-count">{userVideos.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Shorts Created</span>
                      <Badge variant="secondary" data-testid="text-shorts-count">{userShorts.length}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="font-medium">Photos Uploaded</span>
                      <Badge variant="secondary" data-testid="text-photos-count">{userPhotos.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-top-content">Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                  {analytics.topPerformingContent.length > 0 ? (
                    <div className="space-y-4">
                      {analytics.topPerformingContent.map((item: any, index: number) => (
                        <div key={`top-content-${item.id}`} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg" data-testid={`card-top-content-${item.id}`}>
                          <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <img 
                            src={item.thumbnailUrl || '/api/placeholder/60/40'} 
                            alt={item.title}
                            className="w-16 h-10 object-cover rounded"
                            data-testid={`img-top-content-${item.id}`}
                          />
                          <div className="flex-1">
                            <h3 className="font-medium text-sm" data-testid={`text-top-content-title-${item.id}`}>
                              {item.title}
                            </h3>
                            <p className="text-xs text-gray-500" data-testid={`text-top-content-views-${item.id}`}>
                              {(item.views || 0).toLocaleString()} views
                            </p>
                          </div>
                          <Badge variant={item.videoUrl ? "default" : "secondary"}>
                            {item.videoUrl ? 'Video' : 'Short'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500" data-testid="text-no-content-analytics">
                        No content analytics available yet
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle data-testid="text-earnings-breakdown">Earnings Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <h3 className="text-xl font-bold text-green-600" data-testid="text-video-earnings">
                          {formatEarnings(userVideos.reduce((sum: number, video: any) => sum + (video.earnings || 0), 0))}
                        </h3>
                        <p className="text-sm text-gray-600">From Videos</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <h3 className="text-xl font-bold text-purple-600" data-testid="text-shorts-earnings">
                          {formatEarnings(userShorts.reduce((sum: number, short: any) => sum + (short.earnings || 0), 0))}
                        </h3>
                        <p className="text-sm text-gray-600">From Shorts</p>
                      </div>
                      <div className="text-center p-4 bg-pink-50 rounded-lg">
                        <h3 className="text-xl font-bold text-pink-600" data-testid="text-photos-earnings">
                          {formatEarnings(userPhotos.reduce((sum: number, photo: any) => sum + (photo.earnings || 0), 0))}
                        </h3>
                        <p className="text-sm text-gray-600">From Photos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

        </div>
      </div>
      <MobileNav />
    </div>
  );
}