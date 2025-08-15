import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import VideoCard from "@/components/content/video-card";
import ShortsCard from "@/components/content/shorts-card";
import PhotoCard from "@/components/content/photo-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter } from "lucide-react";
import type { Video, Shorts, Photo } from "@shared/schema";

type SearchFilter = "all" | "videos" | "shorts" | "photos" | "channels";

export default function Search() {
  const [location] = useLocation();
  const [activeFilter, setActiveFilter] = useState<SearchFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract search query from URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(decodeURIComponent(query));
    }
  }, [location]);

  const { data: allContent, isLoading } = useQuery<(Video | Shorts | Photo)[]>({
    queryKey: ["/api/content"],
  });

  // Filter content based on search query and active filter
  const getFilteredContent = () => {
    if (!allContent || !searchQuery) return [];

    // Search through titles and descriptions
    const filtered = allContent.filter((item) => {
      const title = item.title.toLowerCase();
      const description = (item.description || "").toLowerCase();
      const query = searchQuery.toLowerCase();
      
      return title.includes(query) || description.includes(query);
    });

    // Apply type filter
    switch (activeFilter) {
      case "videos":
        return filtered.filter(item => "duration" in item && (item as any).duration > 60);
      case "shorts":
        return filtered.filter(item => "videoUrl" in item && "thumbnailUrl" in item && (item as any).duration <= 60);
      case "photos":
        return filtered.filter(item => "imageUrl" in item);
      case "channels":
        // For now, no channel search since we don't have user search endpoint
        return [];
      default:
        return filtered;
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
    { id: "videos", label: "Videos" },
    { id: "shorts", label: "Shorts" },
    { id: "photos", label: "Photos" },
    { id: "channels", label: "Channels" },
  ] as const;

  const filteredContent = getFilteredContent();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-7xl mx-auto">
        {/* Search Results Header */}
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-medium text-gray-900">
                Search results for "{searchQuery}"
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {filteredContent.length} {filteredContent.length === 1 ? 'result' : 'results'}
              </p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="px-4 py-3 overflow-x-auto border-b border-gray-100">
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

        {/* Search Results */}
        <div className="px-4 py-4">
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
              ) : !searchQuery ? (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Start searching</h3>
                    <p className="text-gray-600">Enter a search term to find videos, shorts, and photos</p>
                  </div>
                </div>
              ) : filteredContent.length > 0 ? (
                filteredContent.map(renderContentCard)
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-500 mb-4">
                    <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try different keywords or browse content from the home page
                    </p>
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