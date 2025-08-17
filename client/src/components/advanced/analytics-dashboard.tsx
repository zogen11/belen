import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Users, Eye, Heart, DollarSign, Clock, Globe, Target } from "lucide-react";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("7d");

  const analytics = {
    overview: {
      totalViews: 1234567,
      totalEarnings: 2456.78,
      followers: 12450,
      engagementRate: 8.5,
      growthRate: 15.3
    },
    recent: [
      { metric: "Video Views", value: "23,456", change: "+12%", trend: "up" },
      { metric: "Short Views", value: "89,123", change: "+25%", trend: "up" },
      { metric: "Photo Likes", value: "5,678", change: "+8%", trend: "up" },
      { metric: "New Followers", value: "342", change: "+18%", trend: "up" }
    ],
    topContent: [
      { title: "Cooking Pasta Like a Pro", type: "Video", views: "45.2K", earnings: "$125.30" },
      { title: "Quick Recipe Tips", type: "Short", views: "23.1K", earnings: "$67.89" },
      { title: "Beautiful Food Photo", type: "Photo", likes: "8.9K", earnings: "$34.50" }
    ],
    demographics: {
      ageGroups: [
        { range: "18-24", percentage: 35 },
        { range: "25-34", percentage: 42 },
        { range: "35-44", percentage: 18 },
        { range: "45+", percentage: 5 }
      ],
      locations: [
        { country: "United States", percentage: 45 },
        { country: "United Kingdom", percentage: 22 },
        { country: "Canada", percentage: 15 },
        { country: "Australia", percentage: 18 }
      ]
    }
  };

  const MetricCard = ({ icon: Icon, title, value, change, trend }: any) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <Badge variant={trend === "up" ? "default" : "secondary"} className="text-xs">
            {change}
          </Badge>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold">{value}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Track your content performance and earnings</p>
        </div>
        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d"].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
              data-testid={`button-timerange-${range}`}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analytics.recent.map((metric, index) => (
              <MetricCard
                key={index}
                icon={index === 0 ? Eye : index === 1 ? Eye : index === 2 ? Heart : Users}
                title={metric.metric}
                value={metric.value}
                change={metric.change}
                trend={metric.trend}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
                <CardDescription>Your content metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">Interactive chart coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="font-medium">8.5%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Growth Rate</span>
                    <span className="font-medium">15.3%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Quality</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Content</CardTitle>
              <CardDescription>Your best content from the last {timeRange}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topContent.map((content, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{content.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {content.type}
                        </Badge>
                        <span>{'views' in content ? `${content.views} views` : `${content.likes} likes`}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-green-600">{content.earnings}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.demographics.ageGroups.map((group, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{group.range}</span>
                      <span className="font-medium">{group.percentage}%</span>
                    </div>
                    <Progress value={group.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {analytics.demographics.locations.map((location, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{location.country}</span>
                      <span className="font-medium">{location.percentage}%</span>
                    </div>
                    <Progress value={location.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="earnings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">Total Earnings</span>
                </div>
                <span className="text-2xl font-bold text-green-600">$2,456.78</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">This Month</span>
                </div>
                <span className="text-2xl font-bold text-blue-600">$567.89</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">RPM</span>
                </div>
                <span className="text-2xl font-bold text-purple-600">$2.45</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}