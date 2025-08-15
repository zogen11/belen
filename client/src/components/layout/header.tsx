import { Link, useLocation } from "wouter";
import { Search, Plus, Cast, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* BeLen Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <img 
                src="/attached_assets/afed63ad-fb44-4e24-855a-f259f4f3029d_20250814_093911_0000_1755250067955.jpg" 
                alt="BeLen" 
                className="w-8 h-8 rounded-lg mr-2"
              />
              <span className="text-black font-medium text-xl">BeLen</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-2 pr-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Cast className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">9+</span>
              </div>
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full md:hidden">
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              Y
            </div>
          </div>
        </div>
      </div>

    </header>
  );
}
