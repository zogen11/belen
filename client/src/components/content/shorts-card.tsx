import { useState } from "react";
import { Play, Eye, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import type { Shorts } from "@shared/schema";

interface ShortsCardProps {
  shorts: Shorts;
}

export default function ShortsCard({ shorts }: ShortsCardProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const isOwner = user && user.id === shorts.userId;

  const incrementViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/shorts/${shorts.id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shorts"] });
    }
  });

  const handlePlay = () => {
    if (!hasViewed) {
      setHasViewed(true);
      incrementViewMutation.mutate();
    }
    // Navigate to shorts player
    window.location.href = `/shorts/${shorts.id}`;
  };

  const formatDuration = (seconds: number) => {
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={handlePlay}>
      {/* Shorts Thumbnail */}
      <div className="relative w-24 h-32 md:w-32 md:h-44 flex-shrink-0 group">
        <video
          src={shorts.videoUrl}
          poster={shorts.thumbnailUrl}
          className="w-full h-full object-cover rounded-lg"
          muted
          loop
          preload="metadata"
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => e.currentTarget.pause()}
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-bold">
          SHORTS
        </div>
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-medium">
          {formatDuration(shorts.duration)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center rounded-lg">
          <Play className="text-white text-xl opacity-0 group-hover:opacity-80 transition-opacity" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {shorts.title.charAt(0).toUpperCase()}
          </div>
          
          {/* Shorts Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {shorts.title}
            </h3>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Creator Channel</p>
              <div className="flex items-center space-x-1">
                <span>{(shorts.views || 0).toLocaleString()} views</span>
                <span>•</span>
                <span>1 hour ago</span>
                {isOwner && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{formatEarnings(shorts.earnings || 0)}</span>
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
