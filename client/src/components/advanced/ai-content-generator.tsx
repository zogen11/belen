import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Video, Camera, Music, Wand2, Brain, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AIContentGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async (type: string) => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "✨ Content Generated!",
        description: `Your ${type} content has been created and saved to drafts`,
      });
    }, 3000);
  };

  const aiFeatures = [
    {
      id: "video",
      title: "AI Video Creation",
      description: "Generate complete videos from text prompts",
      icon: Video,
      color: "bg-blue-500",
      beta: false
    },
    {
      id: "thumbnail",
      title: "Smart Thumbnails",
      description: "Auto-generate eye-catching thumbnails",
      icon: Camera,
      color: "bg-green-500",
      beta: false
    },
    {
      id: "music",
      title: "AI Music Composer",
      description: "Create original soundtracks and beats",
      icon: Music,
      color: "bg-purple-500",
      beta: true
    },
    {
      id: "script",
      title: "Script Writer",
      description: "Generate engaging video scripts",
      icon: Wand2,
      color: "bg-orange-500",
      beta: false
    },
    {
      id: "analytics",
      title: "Viral Predictor",
      description: "Predict content viral potential",
      icon: Brain,
      color: "bg-red-500",
      beta: true
    },
    {
      id: "optimize",
      title: "Content Optimizer",
      description: "AI-powered content enhancement",
      icon: Zap,
      color: "bg-yellow-500",
      beta: false
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          AI Content Studio
        </CardTitle>
        <CardDescription>
          Create amazing content with cutting-edge AI technology
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Content</TabsTrigger>
            <TabsTrigger value="features">AI Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="generate" className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="prompt">Content Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the content you want to create... (e.g., 'A cooking video about making pasta with a fun, energetic style')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleGenerate("video")}
                  disabled={isGenerating}
                  className="h-20 flex-col gap-2"
                  data-testid="button-generate-video"
                >
                  <Video className="h-6 w-6" />
                  Generate Video
                </Button>
                
                <Button
                  onClick={() => handleGenerate("short")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  data-testid="button-generate-short"
                >
                  <Camera className="h-6 w-6" />
                  Create Short
                </Button>
                
                <Button
                  onClick={() => handleGenerate("script")}
                  disabled={isGenerating}
                  variant="outline"
                  className="h-20 flex-col gap-2"
                  data-testid="button-generate-script"
                >
                  <Wand2 className="h-6 w-6" />
                  Write Script
                </Button>
              </div>
              
              {isGenerating && (
                <div className="text-center py-8">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">AI is creating your content...</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <Card key={feature.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${feature.color} text-white`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feature.title}</h3>
                          {feature.beta && (
                            <Badge variant="secondary" className="text-xs">Beta</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}