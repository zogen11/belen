import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import Search from "@/pages/search";
import Subscriptions from "@/pages/subscriptions";
import Upload from "@/pages/upload";
import Earnings from "@/pages/earnings";
import Profile from "@/pages/profile";
import ProfileEdit from "@/pages/profile-edit";
import VideoWatch from "@/pages/video-watch";
import ShortsWatch from "@/pages/shorts-watch";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";

function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPage />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <Switch>
      {/* Public routes - accessible without login */}
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/search" component={Search} />
      <Route path="/video/:id" component={VideoWatch} />
      <Route path="/shorts/:id" component={ShortsWatch} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      
      {/* Protected routes - require login */}
      <Route path="/subscriptions" component={() => <ProtectedRoute component={Subscriptions} />} />
      <Route path="/upload" component={() => <ProtectedRoute component={Upload} />} />
      <Route path="/earnings" component={() => <ProtectedRoute component={Earnings} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/profile-edit" component={() => <ProtectedRoute component={ProfileEdit} />} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
