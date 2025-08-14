import { useState } from "react";
import { Heart, DollarSign, Expand } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Photo } from "@shared/schema";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [hasLiked, setHasLiked] = useState(false);
  const queryClient = useQueryClient();

  const incrementLikeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/photos/${photo.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/photos"] });
    }
  });

  const handleLike = () => {
    if (!hasLiked) {
      setHasLiked(true);
      incrementLikeMutation.mutate();
    }
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-square group">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 left-2 bg-belen-blue text-white text-xs font-medium">
          PHOTO
        </Badge>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
          <Expand className="text-white text-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-1">{photo.title}</h3>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <button 
            onClick={handleLike}
            className={`flex items-center space-x-1 ${hasLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
          >
            <Heart className={`w-3 h-3 ${hasLiked ? 'fill-current' : ''}`} />
            <span>{(photo.likes || 0).toLocaleString()} likes</span>
          </button>
          <div className="flex items-center space-x-1 text-belen-green">
            <DollarSign className="w-3 h-3" />
            <span>{formatEarnings(photo.earnings || 0)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
