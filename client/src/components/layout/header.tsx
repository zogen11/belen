import { Link, useLocation } from "wouter";
import { Search, Plus, Cast, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Header() {
  const [location, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* BeLen Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="w-8 h-8 rounded-lg mr-2 bg-gradient-to-br from-purple-600 via-blue-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-black font-medium text-xl">BeLen</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full px-4 py-2 pr-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            </form>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Cast className="w-6 h-6 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Bell className="w-6 h-6 text-gray-600" />
            </button>
            <button 
              onClick={handleMobileSearch}
              className="p-2 hover:bg-gray-100 rounded-full md:hidden"
            >
              <Search className="w-6 h-6 text-gray-600" />
            </button>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              Y
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Overlay */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white px-4 py-3 border-b border-gray-200">
          <form onSubmit={handleSearch} className="flex w-full">
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos, photos, creators..."
                className="w-full px-4 py-2 pr-4 border border-gray-300 rounded-l-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-full hover:bg-gray-200"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </form>
        </div>
      )}

    </header>
  );
}
