import { Link, useLocation } from "wouter";
import { Home, Compass, Plus, TrendingUp, User } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/explore", icon: Compass, label: "Explore" },
    { path: "/upload", icon: Plus, label: "Upload", isSpecial: true },
    { path: "/earnings", icon: TrendingUp, label: "Earnings" },
    { path: "/profile", icon: User, label: "Profile" },
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
                <button className="flex flex-col items-center space-y-1 p-2">
                  <div className="w-8 h-8 bg-belen-orange rounded-full flex items-center justify-center">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs text-gray-400">{item.label}</span>
                </button>
              </Link>
            );
          }

          return (
            <Link key={item.path} href={item.path}>
              <button className={`flex flex-col items-center space-y-1 p-2 ${
                isActive ? "text-belen-orange" : "text-gray-400"
              }`}>
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
