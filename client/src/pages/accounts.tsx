import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Calendar, Users, Eye, Heart, DollarSign } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
  id: string;
  email: string;
  phone?: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  description?: string;
  followers: number;
  following: number;
  totalEarnings: number;
  createdAt: string;
}

function UserCard({ user }: { user: User }) {
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}` 
    : user.username;
  
  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.profileImageUrl} alt={displayName} />
            <AvatarFallback className="text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{displayName}</h3>
              <Badge variant="secondary" className="text-xs">
                @{user.username}
              </Badge>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>

            {/* Description */}
            {user.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {user.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-1 text-sm">
                <Users className="h-4 w-4" />
                <span className="font-medium">{user.followers}</span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Eye className="h-4 w-4" />
                <span className="font-medium">{user.following}</span>
                <span className="text-muted-foreground">following</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">${(user.totalEarnings / 100).toFixed(2)}</span>
                <span className="text-muted-foreground">earned</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <div className="flex items-center gap-4 pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Accounts() {
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
    staleTime: 30000, // Cache for 30 seconds
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">All BeLen Accounts</h1>
          <p className="text-muted-foreground">
            Browse all registered users on the platform. {!isLoading && `${users.length} accounts found`}
          </p>
        </div>

        {error && (
          <Card className="w-full">
            <CardContent className="p-6 text-center">
              <p className="text-red-500">Failed to load accounts. Please try again.</p>
            </CardContent>
          </Card>
        )}

        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <UserSkeleton key={i} />
              ))
            ) : users.length === 0 ? (
              // Empty state
              <Card className="w-full">
                <CardContent className="p-12 text-center">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No accounts found</h3>
                  <p className="text-muted-foreground">
                    No users have registered yet. Be the first to join BeLen!
                  </p>
                </CardContent>
              </Card>
            ) : (
              // User list
              users.map((user) => (
                <UserCard key={user.id} user={user} />
              ))
            )}
          </div>
        </ScrollArea>
      </main>
      
      <MobileNav />
    </div>
  );
}