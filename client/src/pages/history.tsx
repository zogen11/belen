import { useQuery } from "@tanstack/react-query";
import { History, Clock, Play } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { data: videos = [], isLoading: videosLoading } = useQuery<any[]>({
    queryKey: ['/api/videos'],
  });

  const { data: shorts = [], isLoading: shortsLoading } = useQuery<any[]>({
    queryKey: ['/api/shorts'],
  });

  const isLoading = videosLoading || shortsLoading;

  // Combine and sort by most recent (in a real app, this would be actual watch history from database)
  const historyItems = [...videos, ...shorts].sort((a, b) => 
    new Date(b.createdAt || '2024-01-01').getTime() - new Date(a.createdAt || '2024-01-01').getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-20">
        <div className="max-w-6xl mx-auto p-6">
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <History className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle data-testid="text-history-title">Watch History</CardTitle>
                  <p className="text-sm text-gray-600 mt-1" data-testid="text-history-description">
                    Videos and shorts you've watched • Private to you
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="aspect-video rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : historyItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {historyItems.map((item: any, index) => (
                    <div key={`history-${item.id}`} className="group" data-testid={`card-history-${item.id}`}>
                      <div className="relative">
                        <div className="aspect-video rounded-lg overflow-hidden mb-2 cursor-pointer">
                          <img 
                            src={item.thumbnailUrl || '/api/placeholder/300/180'} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            data-testid={`img-history-thumbnail-${item.id}`}
                            onClick={() => window.location.href = item.videoUrl ? `/video/${item.id}` : `/shorts/${item.id}`}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="bg-black/60 rounded-full p-2">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          {/* Duration badge */}
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded" data-testid={`text-duration-${item.id}`}>
                            {item.duration || '2:32'}
                          </div>
                        </div>
                        
                        {/* Remove from history button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 bg-black/60 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          data-testid={`button-remove-history-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            // In a real app, this would remove from watch history
                            console.log('Remove from history:', item.id);
                          }}
                        >
                          <Clock className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <h3 className="font-medium text-sm mb-1 line-clamp-2" data-testid={`text-history-item-title-${item.id}`}>
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500" data-testid={`text-history-creator-${item.id}`}>
                        {item.channelName || 'BeLen Creator'} • {item.views?.toLocaleString() || 0} views
                      </p>
                      <p className="text-xs text-gray-400" data-testid={`text-history-date-${item.id}`}>
                        Watched {new Date(item.createdAt || '2024-01-01').toLocaleDateString()}
                      </p>
                      <Badge variant="secondary" className="mt-1">
                        {item.videoUrl ? 'Video' : 'Short'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2" data-testid="text-empty-history">
                    No recent history found
                  </h3>
                  <p className="text-gray-600 mb-4" data-testid="text-empty-history-description">
                    Videos and shorts you watch will appear here
                  </p>
                  <Button 
                    variant="outline"
                    onClick={() => window.location.href = '/explore'}
                    data-testid="button-browse-content"
                  >
                    Browse Content
                  </Button>
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