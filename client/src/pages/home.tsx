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
import WelcomeShowcase from "@/components/advanced/welcome-showcase";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Video, Shorts, Photo } from "@shared/schema";

type ContentType = "all" | "videos" | "shorts" | "photos" | "trending";

export default function Home() {
  const [activeTab, setActiveTab] = useState<ContentType>("all");
  const { user } = useAuth();

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
    // Check if it's a short by checking if it has thumbnailUrl AND videoUrl (shorts structure)
    // and duration <= 60 seconds
    if ("videoUrl" in item && "thumbnailUrl" in item && (item as any).duration <= 60) {
      return <ShortsCard key={item.id} shorts={item as Shorts} />;
    } else if ("duration" in item) {
      return <VideoCard key={item.id} video={item as Video} />;
    } else if ("imageUrl" in item) {
      return <PhotoCard key={item.id} photo={item as Photo} />;
    } else {
      return <ShortsCard key={(item as any).id} shorts={item as Shorts} />;
    }
  };

  const tabs = [
    { id: "all", label: "All" },
    { id: "trending", label: "New to you" },
    { id: "videos", label: "Music" },
    { id: "shorts", label: "Gaming" },
    { id: "photos", label: "Live" },
    { id: "all", label: "Cooking" },
    { id: "all", label: "Recently uploaded" },
  ] as const;

  const featuredVideo = allContent?.find(item => "duration" in item && item.duration > 60) as Video;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto">
        {/* YouTube-style Filter Chips */}
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex space-x-3">
            {tabs.map((tab, index) => (
              <button
                key={`${tab.id}-${index}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
                  activeTab === tab.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Welcome Showcase for New Users or Feature Highlight */}
        {(!user || allContent?.length === 0) && (
          <div className="px-4 mb-8">
            <WelcomeShowcase />
          </div>
        )}

        {/* YouTube-style Main Feed */}
        <div className="px-4">
          {/* Single Column Feed like YouTube */}
          <div className="max-w-none">

            {/* Content Feed - Single column layout like YouTube */}
            <div className="space-y-4 mb-8">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-4">
                    <Skeleton className="w-40 h-24 md:w-60 md:h-36 rounded-lg flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : (
                getFilteredContent().map(renderContentCard)
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar for larger screens */}
      <div className="hidden xl:block fixed right-4 top-20 w-80 space-y-6">
        <TrendingCreators />
        <EarningsPreview />
        <QuickActions />
      </div>

      <MobileNav />
    </div>
  );
}
