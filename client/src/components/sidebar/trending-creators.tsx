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
    <Card>
      <CardHeader>
        <CardTitle>Trending Creators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {creators?.map((creator) => (
          <div key={creator.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{creator.username}</p>
              <p className="text-sm text-gray-500">{(creator.followers || 0).toLocaleString()} followers</p>
            </div>
            <Button variant="ghost" className="text-belen-orange text-sm font-medium">
              Follow
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
