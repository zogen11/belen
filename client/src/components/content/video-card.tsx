import { useState } from "react";
import { Play, Eye, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  
  const isOwner = user && user.id === video.userId;

  const incrementViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/videos/${video.id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
    }
  });

  const handlePlay = () => {
    if (!hasViewed) {
      setHasViewed(true);
      incrementViewMutation.mutate();
    }
    // Navigate to video player
    navigate(`/video/${video.id}`);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={handlePlay}>
      {/* Thumbnail */}
      <div className="relative w-40 h-24 md:w-60 md:h-36 flex-shrink-0 group">
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-medium">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center rounded-lg">
          <Play className="text-white text-xl opacity-0 group-hover:opacity-80 transition-opacity" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {video.title.charAt(0).toUpperCase()}
          </div>
          
          {/* Video Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {video.title}
            </h3>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Creator Channel</p>
              <div className="flex items-center space-x-1">
                <span>{(video.views || 0).toLocaleString()} views</span>
                <span>•</span>
                <span>2 days ago</span>
                {isOwner && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{formatEarnings(video.earnings || 0)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
