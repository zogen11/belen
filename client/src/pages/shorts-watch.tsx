import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Heart, Share, MoreVertical, Volume2, VolumeX, MessageCircle, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Shorts } from "@shared/schema";

export default function ShortsWatch() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const [hasViewed, setHasViewed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const likeMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/shorts/${id}/like`),
    onSuccess: () => {
      setIsLiked(!isLiked);
      queryClient.invalidateQueries({ queryKey: [`/api/shorts/${id}`] });
      toast({
        title: isLiked ? "Removed like" : "Liked!",
        description: isLiked ? "You unliked this short" : "You liked this short",
      });
    }
  });

  const followMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/users/${shorts?.userId}/follow`),
    onSuccess: () => {
      setIsFollowing(!isFollowing);
      toast({
        title: isFollowing ? "Unfollowed" : "Following!",
        description: isFollowing ? "You unfollowed this creator" : "You are now following this creator",
      });
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

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleFollow = () => {
    followMutation.mutate();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: shorts?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard",
      });
    }
  };

  const handleComment = () => {
    if (comment.trim()) {
      toast({
        title: "Comment posted!",
        description: "Your comment has been added",
      });
      setComment("");
      setShowComments(false);
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
            onClick={handleLike}
            className={`text-white hover:bg-white/20 flex flex-col items-center ${
              isLiked ? "text-red-500" : ""
            }`}
          >
            <Heart className={`w-6 h-6 mb-1 ${isLiked ? "fill-current" : ""}`} />
            <span className="text-xs">{isLiked ? "Liked" : "Like"}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowComments(!showComments)}
            className="text-white hover:bg-white/20 flex flex-col items-center"
          >
            <MessageCircle className="w-6 h-6 mb-1" />
            <span className="text-xs">Comment</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white hover:bg-white/20 flex flex-col items-center"
          >
            <Share className="w-6 h-6 mb-1" />
            <span className="text-xs">Share</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFollow}
            className={`text-white hover:bg-white/20 flex flex-col items-center ${
              isFollowing ? "text-blue-400" : ""
            }`}
          >
            <UserPlus className="w-6 h-6 mb-1" />
            <span className="text-xs">{isFollowing ? "Following" : "Follow"}</span>
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
        
        {/* Comments Panel */}
        {showComments && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm max-h-1/2 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Comments</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
              
              {/* Add Comment */}
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <Button
                    onClick={handleComment}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                  >
                    Post
                  </Button>
                </div>
              </div>
              
              {/* Sample Comments */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">User123</p>
                    <p className="text-gray-300 text-sm">This is amazing! 🔥</p>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
                  <div>
                    <p className="text-white font-medium">CreatorFan</p>
                    <p className="text-gray-300 text-sm">Love your content! Keep it up</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}