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
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-video group cursor-pointer" onClick={handlePlay}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {formatDuration(video.duration)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <Play className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">Creator • 1.2M followers</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{(video.views || 0).toLocaleString()} views</span>
          </div>
          {isOwner && (
            <div className="flex items-center space-x-1 text-belen-green">
              <DollarSign className="w-3 h-3" />
              <span>{formatEarnings(video.earnings || 0)}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
