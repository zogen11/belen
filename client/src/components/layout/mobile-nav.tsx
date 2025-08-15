import { Link, useLocation } from "wouter";
import { Home, Plus, User, PlaySquare, BookmarkIcon } from "lucide-react";

export default function MobileNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/shorts", icon: PlaySquare, label: "Shorts" },
    { path: "/upload", icon: Plus, label: "", isSpecial: true },
    { path: "/subscriptions", icon: BookmarkIcon, label: "Subscriptions" },
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
