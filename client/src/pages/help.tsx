import { Search, FileText, MessageSquare, Send, User, Settings, Shield, DollarSign, Upload, Video, Image, Heart, Lightbulb, HelpCircle, ExternalLink } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface HelpItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description?: string;
}

const popularHelpResources: HelpItem[] = [
  {
    id: "create-account",
    title: "Create an account on BeLen",
    icon: <User className="h-5 w-5 text-blue-600" />,
    description: "Learn how to sign up and get started"
  },
  {
    id: "upload-content",
    title: "Upload videos, photos, and shorts",
    icon: <Upload className="h-5 w-5 text-green-600" />,
    description: "Guide to uploading and managing content"
  },
  {
    id: "earnings",
    title: "Understanding earnings and monetization",
    icon: <DollarSign className="h-5 w-5 text-yellow-600" />,
    description: "How to earn money from your content"
  },
  {
    id: "dark-theme",
    title: "Use BeLen in Dark theme",
    icon: <Settings className="h-5 w-5 text-purple-600" />,
    description: "Switch between light and dark modes"
  },
  {
    id: "ai-features",
    title: "Using AI tools for content creation",
    icon: <Lightbulb className="h-5 w-5 text-orange-600" />,
    description: "Maximize AI features for better content"
  },
  {
    id: "casting",
    title: "Cast BeLen to TV and other devices",
    icon: <Video className="h-5 w-5 text-red-600" />,
    description: "Stream content to external devices"
  },
  {
    id: "account-switching",
    title: "Managing multiple BeLen accounts",
    icon: <User className="h-5 w-5 text-indigo-600" />,
    description: "Switch between different accounts"
  },
  {
    id: "privacy-settings",
    title: "Privacy and security settings",
    icon: <Shield className="h-5 w-5 text-emerald-600" />,
    description: "Control your privacy and data"
  },
  {
    id: "engagement",
    title: "Understanding likes, follows, and engagement",
    icon: <Heart className="h-5 w-5 text-pink-600" />,
    description: "How the social features work"
  },
  {
    id: "language-settings",
    title: "Change language or location settings",
    icon: <Settings className="h-5 w-5 text-teal-600" />,
    description: "Customize your region and language"
  }
];

export default function Help() {
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackEmail, setFeedbackEmail] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Searching help articles",
        description: `Looking for: "${searchQuery.trim()}"`,
      });
    }
  };

  const handleHelpItemClick = (item: HelpItem) => {
    toast({
      title: item.title,
      description: "Opening help article...",
    });
  };

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackText.trim()) {
      toast({
        title: "Feedback sent!",
        description: "Thank you for helping us improve BeLen",
      });
      setFeedbackText("");
      setFeedbackEmail("");
    }
  };

  const handleCommunityPost = () => {
    toast({
      title: "Opening community",
      description: "Redirecting to BeLen Help Community...",
    });
  };

  const filteredResources = popularHelpResources.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Help & Feedback</h1>
          <p className="text-muted-foreground">
            Find answers to your questions and let us know how we can improve BeLen
          </p>
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search help articles..."
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Help Resources */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Popular help resources</h2>
          <div className="space-y-3">
            {filteredResources.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleHelpItemClick(item)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.title}</h3>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Need More Help */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Need more help?</h2>
          
          {/* Community Help */}
          <Card className="mb-4 hover:shadow-md transition-shadow cursor-pointer" onClick={handleCommunityPost}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Post to the help community</h3>
                  <p className="text-sm text-muted-foreground">Get answers from community members and BeLen experts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Send Feedback */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Send className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base">Send Feedback</h3>
                  <p className="text-sm text-muted-foreground">Help us improve BeLen with your suggestions</p>
                </div>
              </div>
              
              <form onSubmit={handleSendFeedback} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your feedback</label>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us what you think about BeLen, report bugs, or suggest new features..."
                    className="min-h-[100px] resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email (optional)</label>
                  <Input
                    type="email"
                    value={feedbackEmail}
                    onChange={(e) => setFeedbackEmail(e.target.value)}
                    placeholder="your.email@example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We'll only use this to follow up on your feedback
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Send Feedback
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Additional Resources */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-medium text-sm">BeLen Creator Guidelines</h3>
                    <p className="text-xs text-muted-foreground">Community standards and best practices</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-sm">Privacy Policy</h3>
                    <p className="text-xs text-muted-foreground">How we protect your data</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <div>
                    <h3 className="font-medium text-sm">Terms of Service</h3>
                    <p className="text-xs text-muted-foreground">Platform rules and agreements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-orange-600" />
                  <div>
                    <h3 className="font-medium text-sm">FAQ</h3>
                    <p className="text-xs text-muted-foreground">Frequently asked questions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}