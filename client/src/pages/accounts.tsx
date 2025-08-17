import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Calendar, Users, Eye, Heart, DollarSign, Check, Plus } from "lucide-react";
import Header from "@/components/layout/header";
import MobileNav from "@/components/layout/mobile-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

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

interface EmailAccount {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  isActive: boolean;
  isRegistered: boolean;
  provider: 'gmail' | 'yahoo' | 'outlook' | 'icloud' | 'other';
}

// Sample email accounts that user might have on their phone
const sampleEmailAccounts: EmailAccount[] = [
  { id: '1', email: 'rezinkaroung@gmail.com', displayName: 'Rezin Karoung', isActive: true, isRegistered: true, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RK' },
  { id: '2', email: 'john.doe@gmail.com', displayName: 'John Doe', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JD' },
  { id: '3', email: 'sarah.smith@yahoo.com', displayName: 'Sarah Smith', isActive: false, isRegistered: false, provider: 'yahoo', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SS' },
  { id: '4', email: 'mike.johnson@outlook.com', displayName: 'Mike Johnson', isActive: false, isRegistered: false, provider: 'outlook', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MJ' },
  { id: '5', email: 'emily.brown@gmail.com', displayName: 'Emily Brown', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=EB' },
  { id: '6', email: 'david.wilson@icloud.com', displayName: 'David Wilson', isActive: false, isRegistered: false, provider: 'icloud', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DW' },
  { id: '7', email: 'lisa.davis@gmail.com', displayName: 'Lisa Davis', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LD' },
  { id: '8', email: 'robert.taylor@yahoo.com', displayName: 'Robert Taylor', isActive: false, isRegistered: false, provider: 'yahoo', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RT' },
  { id: '9', email: 'jessica.martinez@outlook.com', displayName: 'Jessica Martinez', isActive: false, isRegistered: false, provider: 'outlook', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JM' },
  { id: '10', email: 'chris.anderson@gmail.com', displayName: 'Chris Anderson', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CA' },
  { id: '11', email: 'amanda.thomas@icloud.com', displayName: 'Amanda Thomas', isActive: false, isRegistered: false, provider: 'icloud', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AT' },
  { id: '12', email: 'mark.garcia@gmail.com', displayName: 'Mark Garcia', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MG' },
  { id: '13', email: 'nicole.rodriguez@yahoo.com', displayName: 'Nicole Rodriguez', isActive: false, isRegistered: false, provider: 'yahoo', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=NR' },
  { id: '14', email: 'kevin.lee@outlook.com', displayName: 'Kevin Lee', isActive: false, isRegistered: false, provider: 'outlook', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KL' },
  { id: '15', email: 'stephanie.clark@gmail.com', displayName: 'Stephanie Clark', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SC' },
];

function EmailAccountCard({ account, onSwitch }: { account: EmailAccount; onSwitch: (email: string) => void }) {
  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'gmail': return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'yahoo': return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      case 'outlook': return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'icloud': return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <Card className="w-full hover:shadow-md transition-all cursor-pointer group" onClick={() => onSwitch(account.email)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.avatar} alt={account.displayName} />
              <AvatarFallback className="text-sm font-semibold">
                {account.displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {account.isActive && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            )}
          </div>

          {/* Account Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-base truncate">{account.displayName}</h3>
              {account.isActive && (
                <Badge variant="default" className="text-xs">
                  Active
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{account.email}</span>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={`text-xs ${getProviderColor(account.provider)}`}>
                {account.provider.toUpperCase()}
              </Badge>
              {account.isRegistered && (
                <Badge variant="secondary" className="text-xs">
                  BeLen Member
                </Badge>
              )}
            </div>
          </div>

          {/* Switch Indicator */}
          <div className="flex items-center">
            {account.isActive ? (
              <div className="text-green-600 dark:text-green-400">
                <Check className="h-5 w-5" />
              </div>
            ) : (
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground">
                <Users className="h-5 w-5" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
          <Skeleton className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function Accounts() {
  const [accounts, setAccounts] = useState<EmailAccount[]>(sampleEmailAccounts);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8); // Start with 8 accounts

  // Simulate loading and infinite scroll
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSwitchAccount = (email: string) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isActive: acc.email === email
    })));
  };

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 8, accounts.length));
  };

  const visibleAccounts = accounts.slice(0, visibleCount);
  const hasMore = visibleCount < accounts.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Choose an account</h1>
          <p className="text-muted-foreground">
            Scroll down to see all your email accounts, just like YouTube. {!loading && `${accounts.length} accounts available`}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Infinite scrollable container */}
          <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              // Loading skeletons
              Array.from({ length: 8 }).map((_, i) => (
                <AccountSkeleton key={i} />
              ))
            ) : (
              <>
                {/* Account List */}
                {visibleAccounts.map((account) => (
                  <EmailAccountCard 
                    key={account.id} 
                    account={account} 
                    onSwitch={handleSwitchAccount}
                  />
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="flex justify-center py-4">
                    <Button onClick={loadMore} variant="outline" className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Load more accounts ({accounts.length - visibleCount} remaining)
                    </Button>
                  </div>
                )}

                {/* Add New Account */}
                <Card className="w-full border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 text-center">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                        <Plus className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-semibold text-base">Add another account</h3>
                        <p className="text-sm text-muted-foreground">Sign in with a different email</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manage Accounts */}
                <Card className="w-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-base">Manage your BeLen accounts</h3>
                        <p className="text-sm text-muted-foreground">Privacy, security, and account settings</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}