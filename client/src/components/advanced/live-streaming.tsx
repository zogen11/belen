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
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [chatEnabled, setChatEnabled] = useState(true);
  const [donationsEnabled, setDonationsEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query for user's live streams
  const { data: liveStreams = [] } = useQuery({
    queryKey: ['/api/live-streams'],
    enabled: true,
  });

  // Mutation to create live stream
  const createStreamMutation = useMutation({
    mutationFn: (data: any) => apiRequest('/api/live-streams', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: (stream) => {
      setCurrentStream(stream);
      queryClient.invalidateQueries({ queryKey: ['/api/live-streams'] });
      toast({
        title: "Stream Created!",
        description: "Your live stream has been set up successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create stream",
        variant: "destructive",
      });
    }
  });

  // Mutation to update stream status
  const updateStreamStatusMutation = useMutation({
    mutationFn: ({ streamId, status }: { streamId: string, status: string }) =>
      apiRequest(`/api/live-streams/${streamId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      }),
    onSuccess: (stream) => {
      setCurrentStream(stream);
      queryClient.invalidateQueries({ queryKey: ['/api/live-streams'] });
      toast({
        title: stream.status === "live" ? "🔴 Going Live!" : "Stream Ended",
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
      tags: ["live"]
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

  const streamStats = {
    viewers: 1247,
    likes: 342,
    comments: 89,
    donations: 23.45,
    duration: "1:23:45"
  };

  const recentComments = [
    { user: "CookingFan123", message: "Great recipe! 👨‍🍳", time: "2s ago" },
    { user: "FoodLover", message: "Can you show the ingredients again?", time: "15s ago" },
    { user: "ChefMike", message: "Professional technique! 🔥", time: "32s ago" },
    { user: "HomeCook", message: "Following along at home!", time: "1m ago" },
  ];

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

                <Button
                  onClick={handleStartStream}
                  className={`w-full ${isLive ? 'bg-red-500 hover:bg-red-600' : ''}`}
                  size="lg"
                  data-testid="button-start-stream"
                >
                  {isLive ? (
                    <>
                      <Radio className="mr-2 h-5 w-5" />
                      End Stream
                    </>
                  ) : (
                    <>
                      <VideoIcon className="mr-2 h-5 w-5" />
                      Start Live Stream
                    </>
                  )}
                </Button>
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
                      value="live_XXXXXXXXXXXXXXXXXXXX" 
                      readOnly 
                      className="bg-white"
                      data-testid="input-stream-key" 
                    />
                    <Button variant="outline" size="sm">Copy</Button>
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
                  {recentComments.map((comment, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 hover:bg-gray-50 rounded">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                        {comment.user[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{comment.user}</span>
                          <span className="text-xs text-muted-foreground">{comment.time}</span>
                        </div>
                        <p className="text-sm">{comment.message}</p>
                      </div>
                    </div>
                  ))}
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
                  <span className="text-sm font-medium">Peak Viewers</span>
                </div>
                <span className="text-2xl font-bold">2,456</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">Total Likes</span>
                </div>
                <span className="text-2xl font-bold">890</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Donations</span>
                </div>
                <span className="text-2xl font-bold">$67.89</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Radio className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">Duration</span>
                </div>
                <span className="text-2xl font-bold">2:15:30</span>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}