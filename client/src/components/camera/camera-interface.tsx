import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, RotateCcw, Timer, Sparkles, Sun, Zap, Check } from 'lucide-react';
import { useLocation } from 'wouter';

interface CameraInterfaceProps {
  onClose: () => void;
  contentType: 'video' | 'short' | 'photo';
}

export default function CameraInterface({ onClose, contentType }: CameraInterfaceProps) {
  const [, navigate] = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const maxDuration = contentType === 'short' ? 60 : contentType === 'video' ? 600 : 0;

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode,
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: contentType !== 'photo'
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const startRecording = useCallback(() => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { 
        type: contentType === 'photo' ? 'image/jpeg' : 'video/mp4' 
      });
      
      // Here you would handle the recorded media
      console.log('Recording completed:', blob);
      
      // Navigate back to upload page with the recorded file
      navigate('/upload');
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    setRecordingTime(0);

    // Start timer
    intervalRef.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime >= maxDuration) {
          stopRecording();
          return maxDuration;
        }
        return newTime;
      });
    }, 1000);
  }, [stream, contentType, maxDuration, navigate]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRecording]);

  const takePhoto = useCallback(() => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          console.log('Photo taken:', blob);
          navigate('/upload');
        }
      }, 'image/jpeg', 0.9);
    }
  }, [navigate]);

  const handleCapture = () => {
    if (contentType === 'photo') {
      takePhoto();
    } else if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Add sound</span>
          <span className="text-sm text-gray-300">
            {maxDuration > 0 ? `${formatTime(recordingTime)}/${formatTime(maxDuration)}` : '15s'}
          </span>
        </div>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Recording indicator */}
        {isRecording && (
          <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{formatTime(recordingTime)}</span>
          </div>
        )}

        {/* Right side controls */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCamera}
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <RotateCcw className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Timer className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Sun className="w-6 h-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Zap className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-black/40 text-white hover:bg-black/60"
          >
            <Check className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-6 flex items-center justify-between">
        {/* Add Media Button */}
        <Button
          variant="ghost"
          className="flex flex-col items-center space-y-1 text-white hover:bg-white/20"
        >
          <div className="w-8 h-8 border-2 border-white rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xs">Add</span>
        </Button>

        {/* Capture Button */}
        <Button
          onClick={handleCapture}
          className={`w-20 h-20 rounded-full border-4 border-white ${
            isRecording 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-transparent hover:bg-white/20'
          }`}
        >
          <div className={`w-12 h-12 ${
            isRecording 
              ? 'bg-white rounded-sm' 
              : 'bg-red-500 rounded-full'
          }`} />
        </Button>

        {/* Content Type Selector */}
        <div className="flex space-x-4">
          <Button
            variant={contentType === 'video' ? 'secondary' : 'ghost'}
            className="text-white text-sm"
          >
            Video
          </Button>
          <Button
            variant={contentType === 'short' ? 'secondary' : 'ghost'}
            className="text-white text-sm bg-white text-black"
          >
            Short
          </Button>
          <Button
            variant={contentType === 'photo' ? 'secondary' : 'ghost'}
            className="text-white text-sm"
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}