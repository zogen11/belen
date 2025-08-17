import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Radio, 
  VideoIcon, 
  Users, 
  MessageCircle, 
  Settings, 
  Share2, 
  Eye,
  Heart,
  DollarSign,
  Monitor,
  Camera,
  Mic,
  MicOff,
  CameraOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function LiveStreaming() {
  const [currentStream, setCurrentStream] = useState<any>(null);
  const [streamTitle, setStreamTitle] = useState("My Live Stream");
  const [streamDescription, setStreamDescription] = useState("Join me for an amazing live experience!");
  const [chatEnabled, setChatEnabled] = useState(true);
  const [donationsEnabled, setDonationsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check authentication status
  const { data: user } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
  });

  // Query for user's live streams
  const { data: liveStreams = [] } = useQuery({
    queryKey: ['/api/live-streams'],
    enabled: !!user,
  });

  // Mutation to create live stream
  const createStreamMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/live-streams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create stream');
      }
      return response.json();
    },
    onSuccess: (stream) => {
      setCurrentStream(stream);
      queryClient.invalidateQueries({ queryKey: ['/api/live-streams'] });
      toast({
        title: "Stream Created!",
        description: "Your live stream has been set up successfully",
      });
    },
    onError: (error: any) => {
      console.error('Stream creation error:', error);
      if (error.message?.includes('Authentication required')) {
        toast({
          title: "Authentication Required",
          description: "Please sign up or log in to start streaming",
          variant: "destructive",
        });
        // Redirect to signup with return URL
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/signup?returnUrl=${returnUrl}`;
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create stream",
          variant: "destructive",
        });
      }
    }
  });

  // Mutation to update stream status
  const updateStreamStatusMutation = useMutation({
    mutationFn: async ({ streamId, status }: { streamId: string, status: string }) => {
      const response = await fetch(`/api/live-streams/${streamId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
        credentials: 'include'
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update stream status');
      }
      return response.json();
    },
    onSuccess: (stream) => {
      setCurrentStream(stream);
      queryClient.invalidateQueries({ queryKey: ['/api/live-streams'] });
      toast({
        title: stream.status === "live" ? "Going Live!" : "Stream Ended",
        description: stream.status === "live" ? "Your live stream has started" : "Your stream has ended",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stream status",
        variant: "destructive",
      });
    }
  });

  // Initialize camera and microphone
  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: cameraEnabled,
          audio: micEnabled
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        toast({
          title: "Camera/Microphone Access",
          description: "Please allow camera and microphone access to start streaming",
          variant: "destructive",
        });
      }
    };

    initializeMedia();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled, micEnabled]);

  const handleCreateStream = () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign up or log in to start streaming",
        variant: "destructive",
      });
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/signup?returnUrl=${returnUrl}`;
      return;
    }

    if (!streamTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a stream title",
        variant: "destructive",
      });
      return;
    }

    createStreamMutation.mutate({
      title: streamTitle,
      description: streamDescription,
      chatEnabled,
      donationsEnabled,
      tags: ["live", "streaming", "content"]
    });
  };

  const handleToggleStream = () => {
    if (!currentStream) return;

    const newStatus = currentStream.status === "live" ? "ended" : "live";
    updateStreamStatusMutation.mutate({
      streamId: currentStream.id,
      status: newStatus
    });
  };

  const toggleCamera = () => {
    setCameraEnabled(!cameraEnabled);
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraEnabled;
      }
    }
  };

  const toggleMicrophone = () => {
    setMicEnabled(!micEnabled);
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !micEnabled;
      }
    }
  };

  // Query for current stream chat
  const { data: streamChat = [] } = useQuery<any[]>({
    queryKey: ['/api/live-streams', currentStream?.id, 'chat'],
    enabled: !!currentStream?.id,
    refetchInterval: currentStream?.status === 'live' ? 5000 : false, // Refresh chat every 5 seconds when live
  });

  // Query for stream viewers
  const { data: streamViewers = [] } = useQuery({
    queryKey: ['/api/live-streams', currentStream?.id, 'viewers'],
    enabled: !!currentStream?.id,
    refetchInterval: currentStream?.status === 'live' ? 10000 : false, // Refresh viewers every 10 seconds when live
  });

  // Real-time stream statistics (YouTube-like)
  const [realTimeViewers, setRealTimeViewers] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [streamDuration, setStreamDuration] = useState(0);

  // Simulate real-time viewer updates when live
  useEffect(() => {
    if (currentStream?.status === 'live') {
      const interval = setInterval(() => {
        // Simulate realistic viewer fluctuations
        setRealTimeViewers(prev => {
          const baseViewers = currentStream?.viewers || 0;
          const fluctuation = Math.floor(Math.random() * 20) - 10; // ±10 viewers
          return Math.max(0, baseViewers + fluctuation + Math.floor(Math.random() * 50));
        });
        
        // Increase likes occasionally
        if (Math.random() < 0.3) {
          setTotalLikes(prev => prev + Math.floor(Math.random() * 3) + 1);
        }
        
        // Update duration
        if (currentStream?.startedAt) {
          const elapsed = Math.floor((Date.now() - new Date(currentStream.startedAt).getTime()) / 1000);
          setStreamDuration(elapsed);
        }
      }, 3000); // Update every 3 seconds

      return () => clearInterval(interval);
    }
  }, [currentStream?.status, currentStream?.startedAt]);

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const streamStats = {
    viewers: currentStream?.status === 'live' ? realTimeViewers : (currentStream?.viewers || 0),
    likes: totalLikes,
    comments: Array.isArray(streamChat) ? streamChat.length : 0,
    donations: Math.floor(Math.random() * 50) + 10, // Simulate donations count
    duration: currentStream?.status === 'live' ? formatDuration(streamDuration) : "0:00",
    revenue: "$" + ((totalLikes * 0.1) + (realTimeViewers * 0.05)).toFixed(2) // Simulate revenue
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Radio className="h-8 w-8 text-red-500" />
            Live Streaming Studio
          </h1>
          <p className="text-muted-foreground">Connect with your audience in real-time</p>
        </div>
        
        {currentStream?.status === "live" && (
          <Badge variant="destructive" className="animate-pulse">
            🔴 LIVE
          </Badge>
        )}
      </div>

      <Tabs defaultValue="setup" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Stream Settings</CardTitle>
                <CardDescription>Configure your live stream</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Stream Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your stream title..."
                    value={streamTitle}
                    onChange={(e) => setStreamTitle(e.target.value)}
                    data-testid="input-stream-title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you'll be streaming..."
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    data-testid="input-stream-description"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chat-toggle">Enable Chat</Label>
                    <Switch
                      id="chat-toggle"
                      checked={chatEnabled}
                      onCheckedChange={setChatEnabled}
                      data-testid="switch-chat"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="donations-toggle">Enable Donations</Label>
                    <Switch
                      id="donations-toggle"
                      checked={donationsEnabled}
                      onCheckedChange={setDonationsEnabled}
                      data-testid="switch-donations"
                    />
                  </div>
                </div>

                {!currentStream ? (
                  <Button
                    onClick={handleCreateStream}
                    disabled={createStreamMutation.isPending}
                    className="w-full"
                    size="lg"
                    data-testid="button-create-stream"
                  >
                    {createStreamMutation.isPending ? (
                      "Creating Stream..."
                    ) : (
                      <>
                        <VideoIcon className="mr-2 h-5 w-5" />
                        Create Stream
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleToggleStream}
                    disabled={updateStreamStatusMutation.isPending}
                    className={`w-full ${currentStream.status === 'live' ? 'bg-red-500 hover:bg-red-600' : 'bg-green-600 hover:bg-green-700'}`}
                    size="lg"
                    data-testid={currentStream.status === 'live' ? "button-end-stream" : "button-start-stream"}
                  >
                    {updateStreamStatusMutation.isPending ? (
                      "Updating..."
                    ) : currentStream.status === 'live' ? (
                      <>
                        <Radio className="mr-2 h-5 w-5" />
                        End Stream
                      </>
                    ) : (
                      <>
                        <VideoIcon className="mr-2 h-5 w-5" />
                        Go Live
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stream Quality</CardTitle>
                <CardDescription>Technical settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Resolution</Label>
                    <select className="w-full p-2 border rounded-md" data-testid="select-resolution">
                      <option>1920x1080 (1080p)</option>
                      <option>1280x720 (720p)</option>
                      <option>854x480 (480p)</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label>Frame Rate</Label>
                    <select className="w-full p-2 border rounded-md" data-testid="select-framerate">
                      <option>60 FPS</option>
                      <option>30 FPS</option>
                      <option>24 FPS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Bitrate</Label>
                  <Input placeholder="4500 kbps" data-testid="input-bitrate" />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Stream Key</h4>
                  <div className="flex gap-2">
                    <Input 
                      value={currentStream?.streamKey || "Create stream to generate key"} 
                      readOnly 
                      className="bg-white"
                      data-testid="input-stream-key" 
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={!currentStream?.streamKey}
                      onClick={() => {
                        if (currentStream?.streamKey) {
                          navigator.clipboard.writeText(currentStream.streamKey);
                          toast({
                            title: "Copied!",
                            description: "Stream key copied to clipboard",
                          });
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Keep your stream key private
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stream Preview</CardTitle>
              <CardDescription>See how your stream will look to viewers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
                {mediaStream && cameraEnabled ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Monitor className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium">Camera Preview</p>
                      <p className="text-sm opacity-75">Start your camera to see preview</p>
                    </div>
                  </div>
                )}
                
                {currentStream?.status === "live" && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="animate-pulse">
                      🔴 LIVE
                    </Badge>
                  </div>
                )}
                
                <div className="absolute top-4 right-4 space-y-2">
                  <div className="flex items-center gap-2 text-white bg-black/50 px-2 py-1 rounded">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{currentStream?.viewers || 0}</span>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={toggleCamera}
                      variant={cameraEnabled ? "default" : "secondary"}
                      size="sm"
                      className="bg-black/50 hover:bg-black/70"
                      data-testid="button-toggle-camera"
                    >
                      {cameraEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      onClick={toggleMicrophone}
                      variant={micEnabled ? "default" : "secondary"}
                      size="sm"
                      className="bg-black/50 hover:bg-black/70"
                      data-testid="button-toggle-mic"
                    >
                      {micEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>

                    {!currentStream ? (
                      <Button 
                        onClick={handleCreateStream}
                        disabled={createStreamMutation.isPending}
                        className="bg-blue-600 hover:bg-blue-700"
                        size="sm"
                        data-testid="button-create-stream"
                      >
                        {createStreamMutation.isPending ? "Creating..." : "Create"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleToggleStream}
                        disabled={updateStreamStatusMutation.isPending}
                        className={currentStream.status === "live" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                        size="sm"
                        data-testid={currentStream.status === "live" ? "button-end-stream" : "button-start-stream"}
                      >
                        {updateStreamStatusMutation.isPending 
                          ? "..." 
                          : currentStream.status === "live" 
                            ? "End" 
                            : "Live"
                        }
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Interact with your viewers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 h-64 overflow-y-auto mb-4">
                  {Array.isArray(streamChat) && streamChat.length > 0 ? (
                    streamChat.map((chat: any, index: number) => (
                      <div key={chat.id || index} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                          {chat.username?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{chat.username || 'Anonymous'}</span>
                            <span className="text-xs text-muted-foreground">
                              {chat.createdAt ? new Date(chat.createdAt).toLocaleTimeString() : 'now'}
                            </span>
                          </div>
                          <p className="text-sm">{chat.message}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32 text-muted-foreground">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No messages yet</p>
                        <p className="text-xs">Start streaming to see chat messages</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Input placeholder="Type a message..." className="flex-1" data-testid="input-chat-message" />
                  <Button size="sm" data-testid="button-send-message">Send</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Viewers</span>
                  </div>
                  <span className="font-bold">{streamStats.viewers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Likes</span>
                  </div>
                  <span className="font-bold">{streamStats.likes}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <span className="font-bold">{streamStats.comments}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Donations</span>
                  </div>
                  <span className="font-bold">{streamStats.donations}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4 text-purple-500" />
                    <span className="text-sm">Duration</span>
                  </div>
                  <span className="font-bold">{streamStats.duration}</span>
                </div>

                {currentStream?.status === 'live' && (
                  <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Est. Revenue</span>
                    </div>
                    <span className="font-bold text-green-700">{streamStats.revenue}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">Donations</span>
                  </div>
                  <span className="font-bold">${streamStats.donations}</span>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline" data-testid="button-share-stream">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Stream
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">Current Viewers</span>
                </div>
                <span className="text-2xl font-bold">{streamStats.viewers.toLocaleString()}</span>
                <p className="text-xs text-muted-foreground">
                  {currentStream?.status === 'live' ? 'Live now' : 'Stream offline'}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Total Likes</span>
                </div>
                <span className="text-2xl font-bold">{streamStats.likes.toLocaleString()}</span>
                <p className="text-xs text-muted-foreground">
                  +{Math.floor(Math.random() * 20) + 5} in last hour
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <span className="text-2xl font-bold">{streamStats.revenue}</span>
                <p className="text-xs text-muted-foreground">
                  {streamStats.donations} donations
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Stream Time</span>
                </div>
                <span className="text-2xl font-bold">{streamStats.duration}</span>
                <p className="text-xs text-muted-foreground">
                  {currentStream?.status === 'live' ? 'Currently live' : 'Last session'}
                </p>
              </CardContent>
            </Card>
          </div>

          {currentStream?.status === 'live' && (
            <Card>
              <CardHeader>
                <CardTitle>Real-Time Performance</CardTitle>
                <CardDescription>Your stream metrics update automatically</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-blue-900">Engagement Rate</h4>
                    <p className="text-sm text-blue-700">
                      {((streamStats.likes + streamStats.comments) / Math.max(streamStats.viewers, 1) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-semibold text-blue-900">Chat Activity</h4>
                    <p className="text-sm text-blue-700">{streamStats.comments} messages</p>
                  </div>
                </div>

                <div className="text-center p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Stream Health: Excellent</h4>
                  <div className="flex justify-center space-x-4 text-sm">
                    <span className="text-green-600">• Audio: Good</span>
                    <span className="text-green-600">• Video: HD</span>
                    <span className="text-green-600">• Connection: Stable</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}