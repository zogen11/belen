import { useState } from "react";
import { Heart, DollarSign, Expand } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import type { Photo } from "@shared/schema";

interface PhotoCardProps {
  photo: Photo;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  const [hasLiked, setHasLiked] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const isOwner = user && user.id === photo.userId;

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
    <div className="flex gap-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
      {/* Photo Thumbnail */}
      <div className="relative w-40 h-24 md:w-60 md:h-36 flex-shrink-0 group">
        <img
          src={photo.imageUrl}
          alt={photo.title}
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white px-1.5 py-0.5 rounded text-xs font-bold">
          PHOTO
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center rounded-lg">
          <Expand className="text-white text-xl opacity-0 group-hover:opacity-80 transition-opacity" />
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex gap-3">
          {/* Channel Avatar */}
          <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            {photo.title.charAt(0).toUpperCase()}
          </div>
          
          {/* Photo Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
              {photo.title}
            </h3>
            <div className="text-xs text-gray-600 space-y-0.5">
              <p>Creator Channel</p>
              <div className="flex items-center space-x-1">
                <button 
                  onClick={handleLike}
                  className={`flex items-center space-x-1 ${hasLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`}
                >
                  <Heart className={`w-3 h-3 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{(photo.likes || 0).toLocaleString()} likes</span>
                </button>
                <span>•</span>
                <span>3 days ago</span>
                {isOwner && (
                  <>
                    <span>•</span>
                    <span className="text-green-600 font-medium">{formatEarnings(photo.earnings || 0)}</span>
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
