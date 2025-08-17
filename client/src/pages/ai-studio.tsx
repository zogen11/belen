import { useAuth } from "@/contexts/auth-context";
import { Redirect } from "wouter";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import AIContentGenerator from "@/components/advanced/ai-content-generator";

export default function AIStudio() {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <AIContentGenerator />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}