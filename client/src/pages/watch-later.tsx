import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Trash2, Play } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WatchLater() {
  const { data: videos = [] } = useQuery({
    queryKey: ['/api/videos'],
  });

  const { data: shorts = [] } = useQuery({
    queryKey: ['/api/shorts'],
  });

  // Mock watch later items (in real app, this would come from user's saved items)
  const watchLaterItems = [...videos, ...shorts].slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto p-6">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle data-testid="text-watch-later-title">Watch Later</CardTitle>
                  <p className="text-sm text-gray-600 mt-1" data-testid="text-watch-later-description">
                    Content saved for later viewing • Private
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {watchLaterItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {watchLaterItems.map((item: any, index) => (
                    <div key={`watch-later-${item.id}`} className="group" data-testid={`card-watch-later-${item.id}`}>
                      <div className="relative">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2 cursor-pointer">
                          <img 
                            src={item.thumbnailUrl || '/api/placeholder/300/180'} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            data-testid={`img-watch-later-thumbnail-${item.id}`}
                            onClick={() => window.location.href = item.videoUrl ? `/watch/video/${item.id}` : `/watch/shorts/${item.id}`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-black/60 rounded-full p-2">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-black/60 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-medium text-sm mb-1 line-clamp-2" data-testid={`text-watch-later-item-title-${item.id}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500" data-testid={`text-watch-later-creator-${item.id}`}>
                        BeLen Creator • {item.views?.toLocaleString() || 0} views
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {item.videoUrl ? 'Video' : 'Short'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="text-empty-watch-later">
                    No videos saved for later
                  </h3>
                  <p className="text-gray-600" data-testid="text-empty-watch-later-description">
                    Videos and shorts you save will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
        </div>
      </div>
      <MobileNav />
    </div>
  );
}