import { Link, useLocation } from "wouter";
import { Search, Plus, Cast, Bell, LogOut, User, Users, Tv, Monitor, Smartphone, Wifi, Bot, Sparkles, MessageSquare, Image, Video, Wand2, Brain, Zap, Eye, Mic, Languages, TrendingUp, Target, Globe, Camera, Music, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCasting, setIsCasting] = useState(false);
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  const handleCastToDevice = (deviceType: string, deviceName: string) => {
    setIsCasting(true);
    toast({
      title: "Casting to device",
      description: `Now casting to ${deviceName}`,
    });
    
    // Simulate casting process
    setTimeout(() => {
      setIsCasting(false);
      toast({
        title: "Connected",
        description: `Successfully connected to ${deviceName}`,
      });
    }, 2000);
  };

  const handleStopCasting = () => {
    setIsCasting(false);
    toast({
      title: "Casting stopped",
      description: "Disconnected from casting device",
    });
  };

  const handleAIFeature = (feature: string) => {
    toast({
      title: "AI Feature",
      description: `${feature} is now active`,
    });
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* BeLen Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-lg mr-2 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-black font-medium text-xl">BeLen</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 pr-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {/* Cast/Screen Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isCasting ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}>
                  <Cast className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {isCasting ? (
                  <DropdownMenuItem onClick={handleStopCasting} className="text-red-600">
                    <Cast className="mr-2 h-4 w-4" />
                    <span>Stop casting</span>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleCastToDevice('tv', 'Living Room TV')}>
                      <Tv className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Living Room TV</span>
                        <span className="text-xs text-muted-foreground">Samsung Smart TV</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCastToDevice('tv', 'Bedroom TV')}>
                      <Tv className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Bedroom TV</span>
                        <span className="text-xs text-muted-foreground">LG Smart TV</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCastToDevice('monitor', 'Desktop Monitor')}>
                      <Monitor className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Desktop Monitor</span>
                        <span className="text-xs text-muted-foreground">Dell 27 inch</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCastToDevice('phone', 'Android Phone')}>
                      <Smartphone className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Android Phone</span>
                        <span className="text-xs text-muted-foreground">Samsung Galaxy</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleCastToDevice('chromecast', 'Chromecast')}>
                      <Wifi className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>Chromecast</span>
                        <span className="text-xs text-muted-foreground">Google Chromecast</span>
                      </div>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* AI Features Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-purple-600">
                  <Bot className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
                {/* Advanced AI Creation Tools */}
                <DropdownMenuItem onClick={() => handleAIFeature('Neural Content Generation')}>
                  <Brain className="mr-2 h-4 w-4 text-purple-600" />
                  <div className="flex flex-col">
                    <span>Neural Content Generation</span>
                    <span className="text-xs text-muted-foreground">GPT-4 powered viral content creation</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('AI Video Synthesis')}>
                  <Video className="mr-2 h-4 w-4 text-red-600" />
                  <div className="flex flex-col">
                    <span>AI Video Synthesis</span>
                    <span className="text-xs text-muted-foreground">Generate entire videos from text prompts</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('Deep Voice Cloning')}>
                  <Mic className="mr-2 h-4 w-4 text-green-600" />
                  <div className="flex flex-col">
                    <span>Deep Voice Cloning</span>
                    <span className="text-xs text-muted-foreground">Clone any voice with 3 seconds of audio</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('Real-time Face Swap')}>
                  <Eye className="mr-2 h-4 w-4 text-blue-600" />
                  <div className="flex flex-col">
                    <span>Real-time Face Swap</span>
                    <span className="text-xs text-muted-foreground">Live deepfake technology for streaming</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Advanced Analytics & Optimization */}
                <DropdownMenuItem onClick={() => handleAIFeature('Predictive Analytics')}>
                  <TrendingUp className="mr-2 h-4 w-4 text-orange-600" />
                  <div className="flex flex-col">
                    <span>Predictive Analytics</span>
                    <span className="text-xs text-muted-foreground">Predict viral potential before posting</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('AI Audience Targeting')}>
                  <Target className="mr-2 h-4 w-4 text-pink-600" />
                  <div className="flex flex-col">
                    <span>AI Audience Targeting</span>
                    <span className="text-xs text-muted-foreground">Machine learning audience optimization</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('Sentiment Analysis Engine')}>
                  <Zap className="mr-2 h-4 w-4 text-yellow-600" />
                  <div className="flex flex-col">
                    <span>Sentiment Analysis Engine</span>
                    <span className="text-xs text-muted-foreground">Real-time emotion detection in comments</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Advanced Language & Translation */}
                <DropdownMenuItem onClick={() => handleAIFeature('Neural Translation')}>
                  <Languages className="mr-2 h-4 w-4 text-indigo-600" />
                  <div className="flex flex-col">
                    <span>Neural Translation</span>
                    <span className="text-xs text-muted-foreground">Instant content translation to 100+ languages</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('Global Trend Detection')}>
                  <Globe className="mr-2 h-4 w-4 text-cyan-600" />
                  <div className="flex flex-col">
                    <span>Global Trend Detection</span>
                    <span className="text-xs text-muted-foreground">AI-powered worldwide trend analysis</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Advanced Media Generation */}
                <DropdownMenuItem onClick={() => handleAIFeature('AI Music Composer')}>
                  <Music className="mr-2 h-4 w-4 text-emerald-600" />
                  <div className="flex flex-col">
                    <span>AI Music Composer</span>
                    <span className="text-xs text-muted-foreground">Generate original soundtracks and beats</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('3D Scene Generator')}>
                  <Camera className="mr-2 h-4 w-4 text-teal-600" />
                  <div className="flex flex-col">
                    <span>3D Scene Generator</span>
                    <span className="text-xs text-muted-foreground">Create 3D environments from descriptions</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAIFeature('Holographic Thumbnails')}>
                  <Sparkles className="mr-2 h-4 w-4 text-violet-600" />
                  <div className="flex flex-col">
                    <span>Holographic Thumbnails</span>
                    <span className="text-xs text-muted-foreground">Next-gen 3D interactive thumbnails</span>
                  </div>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                {/* Ultimate AI Assistant */}
                <DropdownMenuItem onClick={() => handleAIFeature('AI Creator Genius')}>
                  <Wand2 className="mr-2 h-4 w-4 text-gradient-to-r from-purple-600 to-pink-600" />
                  <div className="flex flex-col">
                    <span className="font-semibold">AI Creator Genius</span>
                    <span className="text-xs text-muted-foreground">Ultimate AI assistant with GPT-4, DALL-E, and more</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              onClick={handleMobileSearch}
              className="p-2 hover:bg-gray-100 rounded-full md:hidden"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            
            {user ? (
              // Authenticated user - show notifications and profile menu
              <>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <Bell className="w-6 h-6 text-gray-600" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium hover:bg-blue-600 transition-colors" data-testid="button-user-menu">
                      {user?.firstName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => navigate('/profile')} data-testid="menu-profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/accounts')} data-testid="menu-accounts">
                      <Users className="mr-2 h-4 w-4" />
                      <span>All Accounts</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/help')} data-testid="menu-help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      <span>Help & Feedback</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} data-testid="menu-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // Non-authenticated user - show sign in button
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full font-medium text-sm">
                  Sign in
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white px-4 py-3 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, photos, creators..."
                className="w-full px-4 py-2 pr-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>
        </div>
      )}

    </header>
  );
}
