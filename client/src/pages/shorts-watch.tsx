import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share, MoreVertical, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import type { Shorts } from "@shared/schema";

export default function ShortsWatch() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();

  const { data: shorts, isLoading, error } = useQuery<Shorts>({
    queryKey: [`/api/shorts/${id}`],
    queryFn: async () => {
      const response = await fetch(`/api/shorts/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch shorts');
      }
      return response.json();
    },
    enabled: !!id,
  });

  const incrementViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/shorts/${id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      queryClient.invalidateQueries({ queryKey: ["/api/shorts"] });
    }
  });

  useEffect(() => {
    if (shorts && !hasViewed) {
      setHasViewed(true);
      incrementViewMutation.mutate();
    }
  }, [shorts, hasViewed, incrementViewMutation]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play();
    }
  }, [shorts]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (error || !shorts) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Failed to load shorts</p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="text-white font-medium">Shorts</div>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative h-full flex items-center justify-center">
        <video
          ref={videoRef}
          src={shorts.videoUrl}
          className="max-h-full max-w-full object-contain"
          loop
          autoPlay
          muted={false}
          controls={false}
        />

        {/* Volume Control */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="absolute top-20 right-4 text-white hover:bg-white/20"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </Button>

        {/* Side Actions */}
        <div className="absolute right-4 bottom-20 flex flex-col space-y-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 flex flex-col items-center"
          >
            <Heart className="w-6 h-6 mb-1" />
            <span className="text-xs">Like</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 flex flex-col items-center"
          >
            <Share className="w-6 h-6 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-white">
            <h2 className="text-lg font-semibold mb-2">{shorts.title}</h2>
            {shorts.description && (
              <p className="text-sm text-gray-300 mb-2">{shorts.description}</p>
            )}
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>{(shorts.views || 0).toLocaleString()} views</span>
              {shorts.earnings && (
                <span className="text-green-400">{formatEarnings(shorts.earnings)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}