import { TrendingUp, Video, Clock, Heart, DollarSign, Eye } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Earnings() {
  // Mock data - in a real app, this would come from API
  const mockEarnings = {
    total: 324785, // in cents
    thisMonth: 89456,
    lastMonth: 72334,
    breakdown: {
      videos: 215640,
      shorts: 84520,
      photos: 24625,
    },
    growth: 23.5,
    stats: {
      totalViews: 1247892,
      totalLikes: 45321,
      avgEarningsPerView: 0.26,
      avgEarningsPerLike: 5.43,
    },
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const recentActivity = [
    { type: "video", title: "Amazing Mountain Adventure", earnings: 45.23, views: 45230, date: "2 hours ago" },
    { type: "shorts", title: "Quick Dance Tutorial", earnings: 12.67, views: 12670, date: "4 hours ago" },
    { type: "photo", title: "Sunset Mountain View", earnings: 8.90, likes: 1780, date: "6 hours ago" },
    { type: "video", title: "Camera Setup Guide", earnings: 23.45, views: 23450, date: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Earnings Dashboard</h1>
          <p className="text-gray-600">Track your content performance and revenue</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatEarnings(mockEarnings.total)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-belen-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatEarnings(mockEarnings.thisMonth)}
                  </p>
                  <p className="text-xs text-green-600">+{mockEarnings.growth}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-belen-green" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockEarnings.stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {mockEarnings.stats.totalLikes.toLocaleString()}
                  </p>
                </div>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earnings Breakdown */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="photos">Photos</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Video className="h-6 w-6 text-red-600" />
                          <div>
                            <p className="font-medium text-gray-900">Video Content</p>
                            <p className="text-sm text-gray-600">
                              {Math.floor(mockEarnings.breakdown.videos / 0.1)} views
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatEarnings(mockEarnings.breakdown.videos)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="h-6 w-6 text-purple-600" />
                          <div>
                            <p className="font-medium text-gray-900">Shorts Content</p>
                            <p className="text-sm text-gray-600">
                              {Math.floor(mockEarnings.breakdown.shorts / 0.1)} views
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatEarnings(mockEarnings.breakdown.shorts)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Heart className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">Photo Content</p>
                            <p className="text-sm text-gray-600">
                              {Math.floor(mockEarnings.breakdown.photos / 0.5)} likes
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-gray-900">
                          {formatEarnings(mockEarnings.breakdown.photos)}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="videos">
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Video analytics would be displayed here</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="photos">
                    <div className="text-center py-8">
                      <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Photo analytics would be displayed here</p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {activity.type === "video" && <Video className="h-5 w-5 text-red-600" />}
                      {activity.type === "shorts" && <Clock className="h-5 w-5 text-purple-600" />}
                      {activity.type === "photo" && <Heart className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {"views" in activity ? `${activity.views} views` : `${activity.likes} likes`}
                      </p>
                      <p className="text-xs text-gray-400">{activity.date}</p>
                    </div>
                    <div className="text-sm font-medium text-belen-green">
                      ${activity.earnings.toFixed(2)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Performance Tips */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Tips to Increase Earnings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-belen-orange rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Upload consistently to maintain audience engagement
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-belen-orange rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Use trending hashtags and keywords in your content
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-belen-orange rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Create eye-catching thumbnails for videos
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-belen-orange rounded-full mt-2"></div>
                  <p className="text-sm text-gray-600">
                    Engage with your audience through comments
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
