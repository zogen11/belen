import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Plus, Check, Settings, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface Account {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  isActive: boolean;
}

interface AccountSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchAccount?: (accountId: string) => void;
}

export default function AccountSwitcher({ isOpen, onClose, onSwitchAccount }: AccountSwitcherProps) {
  const { toast } = useToast();
  
  // Get current user
  const { data: currentUser } = useQuery<Account>({
    queryKey: ["/api/auth/me"],
  });

  // Mock data for multiple accounts (in real app, this would come from localStorage or API)
  const [savedAccounts] = useState<Account[]>([
    {
      id: "1",
      email: "rezinkaroung@gmail.com",
      username: "rezinkaroung", 
      firstName: "Rezin",
      lastName: "Karoung",
      profileImageUrl: "",
      isActive: true
    },
    {
      id: "2",
      email: "comouniversal792@gmail.com",
      username: "comouniversal",
      firstName: "Como",
      lastName: "Universal",
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "3", 
      email: "hazdalemo@gmail.com",
      username: "hazdalemo",
      firstName: "Hazda",
      lastName: "Lemo", 
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "4",
      email: "imakes204@gmail.com", 
      username: "imakes204",
      firstName: "IMakes",
      lastName: "Creator",
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "5",
      email: "sago.karoung@gmail.com",
      username: "sagokaroung", 
      firstName: "Sago",
      lastName: "Karoung",
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "6",
      email: "creationpro205@gmail.com",
      username: "creationpro205",
      firstName: "Creation",
      lastName: "Pro",
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "7",
      email: "rezinkom8080@gmail.com",
      username: "rezinkom8080", 
      firstName: "Rezin",
      lastName: "Kom",
      profileImageUrl: "",
      isActive: false
    },
    {
      id: "8",
      email: "richardkaroung@gmail.com",
      username: "richardkaroung",
      firstName: "Richard", 
      lastName: "Karoung",
      profileImageUrl: "",
      isActive: false
    }
  ]);

  const switchAccountMutation = useMutation({
    mutationFn: async (accountId: string) => {
      // In a real app, this would make an API call to switch accounts
      const selectedAccount = savedAccounts.find(acc => acc.id === accountId);
      if (!selectedAccount) throw new Error("Account not found");
      
      // Simulate switching account
      await new Promise(resolve => setTimeout(resolve, 500));
      return selectedAccount;
    },
    onSuccess: (account) => {
      toast({
        title: "Account switched",
        description: `Switched to ${account.email}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onSwitchAccount?.(account.id);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to switch account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAddAccount = () => {
    toast({
      title: "Add Account",
      description: "Redirecting to login page to add new account...",
    });
    // In real app, this would redirect to login with account selection
    window.location.href = "/login?mode=add-account";
  };

  const handleManageAccounts = () => {
    toast({
      title: "Manage Accounts", 
      description: "Opening account management...",
    });
    onClose();
  };

  const activeAccount = savedAccounts.find(acc => acc.isActive) || savedAccounts[0];
  const otherAccounts = savedAccounts.filter(acc => !acc.isActive);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Accounts</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddAccount}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Active Account */}
          {activeAccount && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">{activeAccount.email}</div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={activeAccount.profileImageUrl} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {activeAccount.firstName?.[0]}{activeAccount.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="font-medium">{activeAccount.firstName} {activeAccount.lastName}</div>
                  <div className="text-sm text-gray-600">No channel</div>
                </div>
                <Check className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          )}

          {/* Other Accounts */}
          {otherAccounts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-900">Other accounts</div>
                {otherAccounts.map((account) => (
                  <Button
                    key={account.id}
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-gray-50"
                    onClick={() => switchAccountMutation.mutate(account.id)}
                    disabled={switchAccountMutation.isPending}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={account.profileImageUrl} />
                        <AvatarFallback className="bg-gray-600 text-white text-sm">
                          {account.firstName?.[0]}{account.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <div className="text-sm">{account.email}</div>
                        <div className="text-xs text-gray-500">
                          {account.firstName} {account.lastName}
                        </div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </>
          )}

          <Separator />

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleManageAccounts}
            >
              <Settings className="h-4 w-4" />
              Manage accounts
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={handleAddAccount}
            >
              <UserPlus className="h-4 w-4" />
              Add another account
            </Button>
          </div>

          <Separator />

          {/* Footer */}
          <div className="text-center">
            <Button variant="link" className="text-sm text-blue-600">
              Learn more about account options
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}