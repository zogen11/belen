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
    <Card>
      <CardHeader>
        <CardTitle>Quick Upload</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href}>
              <Button
                variant="ghost"
                className={`w-full flex items-center justify-center space-x-2 py-3 ${action.bgColor} ${action.textColor} transition-colors`}
              >
                <Icon className="w-4 h-4" />
                <span>{action.label}</span>
              </Button>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
