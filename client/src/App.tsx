import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Explore from "@/pages/explore";
import Search from "@/pages/search";
import Subscriptions from "@/pages/subscriptions";
import Upload from "@/pages/upload";
import Earnings from "@/pages/earnings";
import Profile from "@/pages/profile";
import VideoWatch from "@/pages/video-watch";
import ShortsWatch from "@/pages/shorts-watch";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/search" component={Search} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/upload" component={Upload} />
      <Route path="/earnings" component={Earnings} />
      <Route path="/profile" component={Profile} />
      <Route path="/video/:id" component={VideoWatch} />
      <Route path="/shorts/:id" component={ShortsWatch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
