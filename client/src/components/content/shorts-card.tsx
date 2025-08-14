import { useState } from "react";
import { Play, Eye, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Shorts } from "@shared/schema";

interface ShortsCardProps {
  shorts: Shorts;
}

export default function ShortsCard({ shorts }: ShortsCardProps) {
  const [hasViewed, setHasViewed] = useState(false);
  const queryClient = useQueryClient();

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
  };

  const formatDuration = (seconds: number) => {
    return `0:${seconds.toString().padStart(2, '0')}`;
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[9/16] max-h-80 group cursor-pointer" onClick={handlePlay}>
        <img
          src={shorts.thumbnailUrl}
          alt={shorts.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium">
          SHORT
        </Badge>
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {formatDuration(shorts.duration)}
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <Play className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{shorts.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <Eye className="w-3 h-3" />
            <span>{(shorts.views || 0).toLocaleString()} views</span>
          </div>
          <div className="flex items-center space-x-1 text-belen-green">
            <DollarSign className="w-3 h-3" />
            <span>{formatEarnings(shorts.earnings || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
