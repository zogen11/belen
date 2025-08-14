import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import VideoCard from "@/components/content/video-card";
import ShortsCard from "@/components/content/shorts-card";
import PhotoCard from "@/components/content/photo-card";
import FeaturedVideo from "@/components/content/featured-video";
import TrendingCreators from "@/components/sidebar/trending-creators";
import EarningsPreview from "@/components/sidebar/earnings-preview";
import QuickActions from "@/components/sidebar/quick-actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video, Shorts, Photo } from "@shared/schema";

type ContentType = "all" | "videos" | "shorts" | "photos" | "trending";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ContentType>("all");

  const { data: allContent, isLoading } = useQuery<(Video | Shorts | Photo)[]>({
    queryKey: ["/api/content"],
  });

  const { data: videos } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
    enabled: activeTab === "videos",
  });

  const { data: shorts } = useQuery<Shorts[]>({
    queryKey: ["/api/shorts"],
    enabled: activeTab === "shorts",
  });

  const { data: photos } = useQuery<Photo[]>({
    queryKey: ["/api/photos"],
    enabled: activeTab === "photos",
  });

  const getFilteredContent = () => {
    switch (activeTab) {
      case "videos":
        return videos || [];
      case "shorts":
        return shorts || [];
      case "photos":
        return photos || [];
      case "trending":
        return allContent?.slice(0, 6) || [];
      default:
        return allContent || [];
    }
  };

  const renderContentCard = (item: Video | Shorts | Photo) => {
    if ("duration" in item && item.duration <= 60) {
      return <ShortsCard key={item.id} shorts={item as Shorts} />;
    } else if ("duration" in item) {
      return <VideoCard key={item.id} video={item as Video} />;
    } else {
      return <PhotoCard key={item.id} photo={item as Photo} />;
    }
  };

  const tabs = [
    { id: "all", label: "All Content" },
    { id: "videos", label: "Videos" },
    { id: "shorts", label: "Shorts" },
    { id: "photos", label: "Photos" },
    { id: "trending", label: "Trending" },
  ] as const;

  const featuredVideo = allContent?.find(item => "duration" in item && item.duration > 60) as Video;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Content Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-1 mb-6 flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-belen-orange text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Feed Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Primary Content Feed */}
          <div className="lg:col-span-3">
            {/* Featured Video Section */}
            {featuredVideo && activeTab === "all" && (
              <FeaturedVideo video={featuredVideo} />
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <Skeleton className="aspect-video" />
                    <div className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                getFilteredContent().map(renderContentCard)
              )}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Load More Content
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <TrendingCreators />
            <EarningsPreview />
            <QuickActions />
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}
