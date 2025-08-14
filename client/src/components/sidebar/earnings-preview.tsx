import { TrendingUp, Video, Clock, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function EarningsPreview() {
  // Mock data for now - would normally come from user's earnings
  const mockEarnings = {
    total: 324785, // in cents
    breakdown: {
      videos: 215640,
      shorts: 84520,
      photos: 24625,
    },
    growth: 23.5,
  };

  const formatEarnings = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Earnings</CardTitle>
          <TrendingUp className="h-5 w-5 text-belen-green" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Earnings */}
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total This Month</p>
          <p className="text-2xl font-bold text-belen-green">
            {formatEarnings(mockEarnings.total)}
          </p>
          <p className="text-xs text-green-600">
            +{mockEarnings.growth}% from last month
          </p>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Video className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Video Views</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatEarnings(mockEarnings.breakdown.videos)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Shorts Views</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatEarnings(mockEarnings.breakdown.shorts)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Photo Likes</span>
            </div>
            <span className="font-medium text-gray-900">
              {formatEarnings(mockEarnings.breakdown.photos)}
            </span>
          </div>
        </div>

        <Link href="/earnings">
          <Button className="w-full bg-belen-orange text-white hover:bg-orange-600 transition-colors">
            View Full Analytics
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
