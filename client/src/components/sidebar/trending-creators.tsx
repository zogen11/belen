import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@shared/schema";

export default function TrendingCreators() {
  const { data: creators, isLoading } = useQuery<User[]>({
    queryKey: ["/api/trending-creators"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trending Creators</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium text-gray-900 mb-3 text-sm">Trending Creators</h3>
      <div className="space-y-3">
        {creators?.map((creator) => (
          <div key={creator.id} className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
              {creator.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm truncate">{creator.username}</p>
              <p className="text-xs text-gray-500">{(creator.followers || 0).toLocaleString()} subscribers</p>
            </div>
            <Button variant="ghost" className="text-black text-xs font-medium px-2 py-1 h-auto hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
