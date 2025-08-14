import { useState, useRef } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share, Bookmark, Flag, MoreHorizontal, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import type { Video } from '@shared/schema';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export default function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newComment, setNewComment] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isOwner = user && user.id === video.userId;

  const incrementViewMutation = useMutation({
    mutationFn: () => apiRequest("POST", `/api/videos/${video.id}/view`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    }
  });

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        incrementViewMutation.mutate();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const timeAgo = (date: string | Date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20"
        >
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Video Player */}
      <div className="flex-1 relative bg-black flex items-center justify-center">
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-full object-contain"
          onClick={handlePlay}
          autoPlay
          loop
          muted
        />
        
        {/* Play/Pause overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={handlePlay}
          >
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[16px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent ml-1"></div>
            </div>
          </div>
        )}
      </div>

      {/* Video Info and Controls */}
      <div className="bg-white">
        {/* Video Title and Stats */}
        <div className="p-4 border-b">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h1>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <span>{(video.views || 0).toLocaleString()} views • {timeAgo(video.createdAt || '')}</span>
            {isOwner && (
              <span className="text-belen-green font-medium">{formatEarnings(video.earnings || 0)}</span>
            )}
          </div>
        </div>

        {/* Engagement Controls */}
        <div className="flex items-center justify-around py-3 border-b">
          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 ${liked ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={handleLike}
          >
            <ThumbsUp className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
            <span className="text-xs">Like</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 ${disliked ? 'text-red-500' : 'text-gray-600'}`}
            onClick={handleDislike}
          >
            <ThumbsDown className={`w-6 h-6 ${disliked ? 'fill-current' : ''}`} />
            <span className="text-xs">Dislike</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-gray-600"
          >
            <Share className="w-6 h-6" />
            <span className="text-xs">Share</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center space-y-1 ${saved ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={handleSave}
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
            <span className="text-xs">Save</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-gray-600"
          >
            <Flag className="w-6 h-6" />
            <span className="text-xs">Report</span>
          </Button>
        </div>

        {/* Creator Info */}
        <div className="flex items-center space-x-3 p-4 border-b">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">CreativeExplorer</p>
            <p className="text-sm text-gray-600">125K subscribers</p>
          </div>
          <Button
            variant={isOwner ? "outline" : "default"}
            className={isOwner ? "text-gray-600" : "bg-red-500 text-white hover:bg-red-600"}
          >
            {isOwner ? "Manage" : "Subscribe"}
          </Button>
        </div>

        {/* Description */}
        <div className="p-4 border-b">
          <p className="text-gray-700 text-sm">{video.description}</p>
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {video.tags.map((tag, index) => (
                <span key={index} className="text-blue-500 text-sm">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Comments Section */}
        <div className="p-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between text-left p-0"
            onClick={() => setShowComments(!showComments)}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Comments</span>
              <span className="text-gray-500">12</span>
            </div>
          </Button>
          
          {showComments && (
            <div className="mt-4 space-y-4">
              {/* Add Comment */}
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
              
              {/* Sample Comments */}
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">TechExplorer</span>
                      <span className="text-gray-500 text-xs">2h ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Amazing content! Really loved the adventure scenes.</p>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">AdventureSeeker</span>
                      <span className="text-gray-500 text-xs">5h ago</span>
                    </div>
                    <p className="text-sm text-gray-700">Where is this place? I want to visit!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}