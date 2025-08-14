import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import VideoPlayer from '@/components/video/video-player';
import { useLocation } from 'wouter';
import type { Video } from '@shared/schema';

export default function VideoWatch() {
  const [, navigate] = useLocation();
  const [match, params] = useRoute('/video/:id');
  
  const { data: content } = useQuery<any[]>({
    queryKey: ['/api/content']
  });

  const video = content?.find((item: any) => 
    item.type === 'video' && item.id === params?.id
  ) as Video | undefined;

  if (!match || !video) {
    navigate('/');
    return null;
  }

  return (
    <VideoPlayer 
      video={video} 
      onClose={() => navigate('/')} 
    />
  );
}