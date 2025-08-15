import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import VideoCard from "@/components/content/video-card";
import ShortsCard from "@/components/content/shorts-card";
import PhotoCard from "@/components/content/photo-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, BellOff } from "lucide-react";
import type { Video, Shorts, Photo } from "@shared/schema";

type SubscriptionFilter = "all" | "today" | "videos" | "shorts" | "live";

export default function Subscriptions() {
  const [activeFilter, setActiveFilter] = useState<SubscriptionFilter>("all");

  const { data: allContent, isLoading } = useQuery<(Video | Shorts | Photo)[]>({
    queryKey: ["/api/content"],
  });

  const getFilteredContent = () => {
    if (!allContent) return [];
    
    switch (activeFilter) {
      case "videos":
        return allContent.filter(item => "duration" in item && (item as any).duration > 60);
      case "shorts":
        return allContent.filter(item => "videoUrl" in item && "thumbnailUrl" in item && (item as any).duration <= 60);
      case "today":
        // For demo, show all content as "today"
        return allContent;
      case "live":
        // No live content for now
        return [];
      default:
        return allContent;
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

  const filters = [
    { id: "all", label: "All" },
    { id: "today", label: "Today" },
    { id: "videos", label: "Videos" },
    { id: "shorts", label: "Shorts" },
    { id: "live", label: "Live" },
  ] as const;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto">
        {/* Subscriptions Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Subscriptions</h1>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bell className="w-4 h-4 mr-1" />
                All
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Manage
              </Button>
            </div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-3 overflow-x-auto">
          <div className="flex space-x-3">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap text-sm transition-colors ${
                  activeFilter === filter.id
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subscriptions Feed */}
        <div className="px-4">
          <div className="max-w-none">
            {/* Content Feed */}
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
              ) : getFilteredContent().length > 0 ? (
                getFilteredContent().map(renderContentCard)
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No subscriptions yet</h3>
                    <p className="text-gray-600 mb-4">Subscribe to creators to see their latest content here</p>
                    <Button className="bg-black text-white hover:bg-gray-800">
                      Browse creators
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  );
}