import { useState } from "react";
import { Play, Eye, ThumbsUp, Share, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Video } from "@shared/schema";

interface FeaturedVideoProps {
  video: Video;
}

export default function FeaturedVideo({ video }: FeaturedVideoProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const queryClient = useQueryClient();

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
      <div className="relative aspect-video bg-black group cursor-pointer" onClick={handlePlay}>
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-10 transition-all">
          <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
            <Play className="text-2xl text-gray-800 ml-1" />
          </button>
        </div>

        {/* Video Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="text-white">
            <div className="flex items-center space-x-2 mb-2">
              <Badge className="bg-red-600 text-white text-xs font-medium">LIVE</Badge>
              <span className="bg-black bg-opacity-50 px-2 py-1 rounded text-xs">
                {formatDuration(video.duration)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Details */}
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {video.title}
        </h2>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
            <div>
              <p className="font-medium text-gray-900">Creator Name</p>
              <p className="text-sm text-gray-500">2.4M subscribers</p>
            </div>
          </div>
          <Button className="bg-belen-orange text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
            Subscribe
          </Button>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center space-x-6 text-gray-600">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{video.views.toLocaleString()} views</span>
          </div>
          <div className="flex items-center space-x-2">
            <ThumbsUp className="w-4 h-4" />
            <span>45,321</span>
          </div>
          <div className="flex items-center space-x-2">
            <Share className="w-4 h-4" />
            <span>Share</span>
          </div>
          <div className="flex items-center space-x-2 text-belen-green">
            <DollarSign className="w-4 h-4" />
            <span>{formatEarnings(video.earnings)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
