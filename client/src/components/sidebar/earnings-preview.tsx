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
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900 text-sm">Creator Analytics</h3>
        <TrendingUp className="h-4 w-4 text-green-500" />
      </div>
      
      {/* Total Earnings */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-600">This Month</p>
        <p className="text-lg font-semibold text-gray-900">
          {formatEarnings(mockEarnings.total)}
        </p>
        <p className="text-xs text-green-600">
          +{mockEarnings.growth}% growth
        </p>
      </div>

      {/* Simplified breakdown */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Videos</span>
          <span className="font-medium text-gray-900">
            {formatEarnings(mockEarnings.breakdown.videos)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600">Shorts</span>
          <span className="font-medium text-gray-900">
            {formatEarnings(mockEarnings.breakdown.shorts)}
          </span>
        </div>
      </div>

      <Link href="/earnings">
        <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 transition-colors text-xs py-2">
          View Analytics
        </Button>
      </Link>
    </div>
  );
}
