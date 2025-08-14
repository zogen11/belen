import { Link, useLocation } from "wouter";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="bg-belen-orange rounded-lg p-2 cursor-pointer">
              <span className="text-white font-bold text-xl">BeLen</span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search videos, photos, creators..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-belen-orange focus:border-transparent"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            <Link href="/upload">
              <Button className="bg-belen-orange text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Upload
              </Button>
            </Link>
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Mobile Search (below header) */}
      <div className="md:hidden bg-white px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search content..."
            className="w-full px-4 py-2 pl-10 bg-gray-100 border border-gray-300 rounded-full focus:ring-2 focus:ring-belen-orange"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
