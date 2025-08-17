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

// Your actual Gmail accounts from your phone (based on the image you shared)
const sampleEmailAccounts: EmailAccount[] = [
  { id: '1', email: 'rezinkaroung@gmail.com', displayName: 'Rezin Karoung', isActive: true, isRegistered: true, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RK&backgroundColor=4285f4&color=ffffff' },
  { id: '2', email: 'comouniversal792@gmail.com', displayName: 'Como Universal', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CU&backgroundColor=34a853&color=ffffff' },
  { id: '3', email: 'hazdalemo@gmail.com', displayName: 'Hazda Lemo', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=HL&backgroundColor=fbbc04&color=000000' },
  { id: '4', email: 'imakes204@gmail.com', displayName: 'iMakes Creator', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=IC&backgroundColor=ea4335&color=ffffff' },
  { id: '5', email: 'sago.karoung@gmail.com', displayName: 'Sago Karoung', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SK&backgroundColor=9aa0a6&color=ffffff' },
  { id: '6', email: 'creationpro205@gmail.com', displayName: 'Creation Pro', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CP&backgroundColor=4285f4&color=ffffff' },
  { id: '7', email: 'rezinkom8080@gmail.com', displayName: 'Rezin Kom', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RK2&backgroundColor=34a853&color=ffffff' },
  { id: '8', email: 'richardkaroung@gmail.com', displayName: 'Richard Karoung', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RK3&backgroundColor=fbbc04&color=000000' },
  { id: '9', email: 'business.rezin@gmail.com', displayName: 'Business Rezin', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=BR&backgroundColor=ea4335&color=ffffff' },
  { id: '10', email: 'creator.rezin@gmail.com', displayName: 'Creator Rezin', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CR&backgroundColor=9aa0a6&color=ffffff' },
  { id: '11', email: 'rezin.tech@gmail.com', displayName: 'Rezin Tech', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=RT&backgroundColor=4285f4&color=ffffff' },
  { id: '12', email: 'karoung.family@gmail.com', displayName: 'Karoung Family', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=KF&backgroundColor=34a853&color=ffffff' },
  { id: '13', email: 'video.producer@gmail.com', displayName: 'Video Producer', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=VP&backgroundColor=fbbc04&color=000000' },
  { id: '14', email: 'content.creator@gmail.com', displayName: 'Content Creator', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CC&backgroundColor=ea4335&color=ffffff' },
  { id: '15', email: 'digital.marketing@gmail.com', displayName: 'Digital Marketing', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=DM&backgroundColor=9aa0a6&color=ffffff' },
  { id: '16', email: 'studio.production@gmail.com', displayName: 'Studio Production', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SP&backgroundColor=4285f4&color=ffffff' },
  { id: '17', email: 'music.creator@gmail.com', displayName: 'Music Creator', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=MC&backgroundColor=34a853&color=ffffff' },
  { id: '18', email: 'photography.pro@gmail.com', displayName: 'Photography Pro', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=PP&backgroundColor=fbbc04&color=000000' },
  { id: '19', email: 'social.media@gmail.com', displayName: 'Social Media', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=SM&backgroundColor=ea4335&color=ffffff' },
  { id: '20', email: 'youtube.channel@gmail.com', displayName: 'YouTube Channel', isActive: false, isRegistered: false, provider: 'gmail', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=YC&backgroundColor=9aa0a6&color=ffffff' },
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

  // Simulate loading just like YouTube
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSwitchAccount = (email: string) => {
    setAccounts(prev => prev.map(acc => ({
      ...acc,
      isActive: acc.email === email
    })));
  };

  const activeAccount = accounts.find(acc => acc.isActive);
  const otherAccounts = accounts.filter(acc => !acc.isActive);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto">
          {loading ? (
            // Loading state
            <div className="space-y-4">
              <AccountSkeleton />
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-muted-foreground mb-3">Other accounts</div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <AccountSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Active Account */}
              {activeAccount && (
                <div className="mb-6">
                  <EmailAccountCard 
                    account={activeAccount} 
                    onSwitch={handleSwitchAccount}
                  />
                </div>
              )}

              {/* Other Accounts Section */}
              <div className="border-t pt-4">
                <div className="text-sm font-medium text-muted-foreground mb-3">Other accounts</div>
                
                {/* Scrollable container for other accounts */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto accounts-scroll">
                  {otherAccounts.map((account) => (
                    <EmailAccountCard 
                      key={account.id} 
                      account={account} 
                      onSwitch={handleSwitchAccount}
                    />
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-6 space-y-3">
                {/* Add Another Account */}
                <Card className="w-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/50 flex items-center justify-center">
                        <Plus className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Add another account</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Manage Accounts */}
                <Card className="w-full hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Users className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">Manage accounts</h3>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}