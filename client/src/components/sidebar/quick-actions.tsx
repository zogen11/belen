import { Video, Clock, Camera } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function QuickActions() {
  const actions = [
    {
      href: "/upload?type=video",
      icon: Video,
      label: "Upload Video",
      bgColor: "bg-red-50 hover:bg-red-100",
      textColor: "text-red-600",
    },
    {
      href: "/upload?type=shorts",
      icon: Clock,
      label: "Create Short",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      textColor: "text-purple-600",
    },
    {
      href: "/upload?type=photo",
      icon: Camera,
      label: "Upload Photo",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      textColor: "text-blue-600",
    },
  ];

  return (
    <div className="bg-white rounded-lg border p-4">
      <h3 className="font-medium text-gray-900 mb-3 text-sm">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start space-x-3 py-2 px-3 hover:bg-gray-100 transition-colors text-sm"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <span className="text-gray-700">{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
