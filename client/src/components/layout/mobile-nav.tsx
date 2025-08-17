import { Link, useLocation } from "wouter";
import { Home, Plus, User, Compass, BookmarkIcon, BarChart3, Radio } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/upload", icon: Plus, label: "", isSpecial: true },
    { path: "/analytics", icon: BarChart3, label: "Analytics" },
    { path: "/live", icon: Radio, label: "Live", isLive: true },
    { path: "/profile", icon: User, label: "You" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.path;
          
          if (item.isSpecial) {
            return (
              <Link key={item.path} href={item.path}>
                <button className="flex flex-col items-center justify-center p-2">
                  <div className="w-7 h-7 bg-black rounded-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </button>
              </Link>
            );
          }

          if (item.isLive) {
            return (
              <Link key={item.path} href={item.path}>
                <button className={`flex flex-col items-center space-y-1 p-2 ${
                  isActive ? "text-red-600" : "text-gray-500"
                }`}>
                  <div className="relative">
                    <Icon className="w-6 h-6" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center space-y-1 p-2 ${
                isActive ? "text-black" : "text-gray-500"
              }`}>
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
