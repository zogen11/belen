import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Radio, 
  BarChart3, 
  Video, 
  Camera, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

export default function WelcomeShowcase() {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      id: "ai-studio",
      title: "AI Studio",
      description: "Create viral content with cutting-edge AI technology",
      icon: Sparkles,
      color: "from-purple-500 to-pink-500",
      link: "/ai-studio",
      highlights: [
        "Generate videos from text prompts",
        "Create smart thumbnails automatically", 
        "AI-powered script writing",
        "Viral content prediction"
      ]
    },
    {
      id: "live-streaming",
      title: "Live Streaming",
      description: "Connect with your audience in real-time",
      icon: Radio,
      color: "from-red-500 to-orange-500",
      link: "/live",
      highlights: [
        "Professional streaming tools",
        "Real-time chat interaction",
        "Multiple quality settings",
        "Live donations & analytics"
      ]
    },
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Track performance and optimize your content",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      link: "/analytics",
      highlights: [
        "Detailed performance metrics",
        "Audience demographics",
        "Earnings breakdown",
        "Growth predictions"
      ]
    }
  ];

  const stats = [
    { label: "Creators Using AI", value: "50K+", icon: Users },
    { label: "Content Generated", value: "2M+", icon: Video },
    { label: "Live Streams", value: "100K+", icon: Radio },
    { label: "Revenue Generated", value: "$5M+", icon: DollarSign }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Welcome to BeLen
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The most advanced content creator platform with AI-powered tools, live streaming, and professional analytics
        </p>
        <Badge variant="secondary" className="px-4 py-1">
          ✨ Now with Advanced AI Features
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <IconComponent className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <Card key={feature.id} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {feature.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <Link href={feature.link}>
                  <Button className="w-full group" data-testid={`button-explore-${feature.id}`}>
                    <span>Explore {feature.title}</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Start Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Ready to Start Creating?</h2>
          <p className="text-muted-foreground">
            Choose your path to content creation success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/ai-studio">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" data-testid="button-start-ai">
                <Sparkles className="mr-2 h-5 w-5" />
                Start with AI
              </Button>
            </Link>
            <Link href="/live">
              <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" data-testid="button-go-live">
                <Radio className="mr-2 h-5 w-5" />
                Go Live Now
              </Button>
            </Link>
            <Link href="/upload">
              <Button size="lg" variant="outline" data-testid="button-upload-content">
                <Camera className="mr-2 h-5 w-5" />
                Upload Content
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Platform Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span>Grow Your Audience</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Use our AI-powered tools to create viral content, optimize your posting schedule, 
              and connect with audiences worldwide through live streaming.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <span>Maximize Earnings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Track your revenue with detailed analytics, optimize your content strategy, 
              and monetize through multiple channels including live donations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}