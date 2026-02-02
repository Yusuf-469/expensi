"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  Search,
  Mail,
  Phone,
  ArrowRightLeft,
  Trash2,
  Check,
  X,
  Copy,
  Share2,
  QrCode,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, getInitials } from "@/lib/utils";
import { useToast } from "@/components/expensi/ToastProvider";

export default function FriendsPage() {
  const { user } = useAuth();
  const { friends, balances, addFriend, removeFriend, acceptFriend } =
    useExpenses();
  const { addToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
  const [addMethod, setAddMethod] = useState<"email" | "phone">("email");
  const [newFriendEmail, setNewFriendEmail] = useState("");
  const [newFriendPhone, setNewFriendPhone] = useState("");
  const [newFriendName, setNewFriendName] = useState("");
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [showInviteLink, setShowInviteLink] = useState(false);

  // Filter friends
  const filteredFriends = friends.filter((friend) =>
    friend.friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Separate into owes you / you owe
  const friendsWhoOweMe = filteredFriends.filter(
    (f) => (balances.friendBalances[f.friendId] || 0) > 0
  );
  const friendsIOwe = filteredFriends.filter(
    (f) => (balances.friendBalances[f.friendId] || 0) < 0
  );
  const settledFriends = filteredFriends.filter(
    (f) => (balances.friendBalances[f.friendId] || 0) === 0
  );

  const handleAddFriend = () => {
    if (addMethod === "email" && newFriendEmail) {
      const mockFriend = {
        id: `user-${Date.now()}`,
        name: newFriendName || newFriendEmail.split("@")[0],
        email: newFriendEmail,
        phone: "",
        avatar: "",
        defaultCurrency: "USD" as const,
        createdAt: new Date().toISOString(),
      };
      addFriend(mockFriend.id, mockFriend);
      addToast({ title: "Friend added successfully!", type: "success" });
      resetForm();
    } else if (addMethod === "phone" && newFriendPhone) {
      const mockFriend = {
        id: `user-${Date.now()}`,
        name: newFriendName || `Friend ${newFriendPhone.slice(-4)}`,
        email: "",
        phone: newFriendPhone,
        avatar: "",
        defaultCurrency: "USD" as const,
        createdAt: new Date().toISOString(),
      };
      addFriend(mockFriend.id, mockFriend);
      addToast({ title: "Friend added successfully!", type: "success" });
      resetForm();
    }
  };

  const resetForm = () => {
    setNewFriendEmail("");
    setNewFriendPhone("");
    setNewFriendName("");
    setIsAddFriendOpen(false);
  };

  const handleCopyInviteLink = () => {
    const inviteLink = `https://expensi.app/invite/${user?.id}`;
    navigator.clipboard.writeText(inviteLink);
    addToast({ title: "Invite link copied to clipboard!", type: "success" });
  };

  const handleShareInvite = async () => {
    const inviteLink = `https://expensi.app/invite/${user?.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Expensi",
          text: "Split bills and track expenses together!",
          url: inviteLink,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyInviteLink();
    }
  };

  const selectedFriendData = selectedFriend
    ? friends.find((f) => f.friendId === selectedFriend)
    : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Friends</h1>
            <p className="text-muted-foreground">
              Manage your friends and balances
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInviteLink(true)}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Invite
            </Button>
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={() => setIsAddFriendOpen(true)}
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Friend
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search friends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Friends List */}
        <div className="space-y-6">
          {/* Friends who owe you */}
          {friendsWhoOweMe.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Owes You
              </h2>
              <div className="space-y-3">
                {friendsWhoOweMe.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedFriend(friend.friendId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A]">
                              {getInitials(friend.friend.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {friend.friend.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {friend.friend.email || friend.friend.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              {formatCurrency(
                                balances.friendBalances[friend.friendId] || 0,
                                user?.defaultCurrency || "USD"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              owes you
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Friends you owe */}
          {friendsIOwe.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                You Owe
              </h2>
              <div className="space-y-3">
                {friendsIOwe.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedFriend(friend.friendId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-red-100 text-red-600">
                              {getInitials(friend.friend.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {friend.friend.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {friend.friend.email || friend.friend.phone}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-red-600">
                              {formatCurrency(
                                Math.abs(
                                  balances.friendBalances[friend.friendId] || 0
                                ),
                                user?.defaultCurrency || "USD"
                              )}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              you owe
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Settled friends */}
          {settledFriends.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Settled Up
              </h2>
              <div className="space-y-3">
                {settledFriends.map((friend) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                  >
                    <Card
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedFriend(friend.friendId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {getInitials(friend.friend.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h3 className="font-medium">
                              {friend.friend.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {friend.friend.email || friend.friend.phone}
                            </p>
                          </div>
                          <Badge variant="secondary">Settled up</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {filteredFriends.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No friends yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add friends to start splitting expenses
                </p>
                <Button
                  className="bg-[#1D9C5A] hover:bg-[#157A46]"
                  onClick={() => setIsAddFriendOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friend
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Friend Dialog */}
      <Dialog open={isAddFriendOpen} onOpenChange={setIsAddFriendOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-[#1D9C5A]" />
              Add Friend
            </DialogTitle>
            <DialogDescription>
              Add a friend by email or phone number
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={addMethod} onValueChange={(v) => setAddMethod(v as "email" | "phone")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="email">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </TabsTrigger>
              <TabsTrigger value="phone">
                <Phone className="w-4 h-4 mr-2" />
                Phone
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="email" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name (Optional)</label>
                <Input
                  placeholder="John Doe"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="friend@example.com"
                    value={newFriendEmail}
                    onChange={(e) => setNewFriendEmail(e.target.value)}
                    className="pl-10"
                    type="email"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="phone" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name (Optional)</label>
                <Input
                  placeholder="John Doe"
                  value={newFriendName}
                  onChange={(e) => setNewFriendName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="+1 (555) 123-4567"
                    value={newFriendPhone}
                    onChange={(e) => setNewFriendPhone(e.target.value)}
                    className="pl-10"
                    type="tel"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAddFriendOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={handleAddFriend}
              disabled={addMethod === "email" ? !newFriendEmail : !newFriendPhone}
            >
              Add Friend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Link Dialog */}
      <Dialog open={showInviteLink} onOpenChange={setShowInviteLink}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#1D9C5A]" />
              Invite Friends
            </DialogTitle>
            <DialogDescription>
              Share this link with friends to invite them to Expensi
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm break-all">
                  https://expensi.app/invite/{user?.id}
                </code>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopyInviteLink}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCopyInviteLink}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
              <Button
                className="w-full bg-[#1D9C5A] hover:bg-[#157A46]"
                onClick={handleShareInvite}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
              <QrCode className="w-8 h-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Scan QR Code</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Friend Detail Dialog */}
      <Dialog
        open={!!selectedFriend}
        onOpenChange={() => setSelectedFriend(null)}
      >
        <DialogContent className="sm:max-w-[500px]">
          {selectedFriendData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A]">
                      {getInitials(selectedFriendData.friend.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p>{selectedFriendData.friend.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedFriendData.friend.email || selectedFriendData.friend.phone}
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">
                    Current Balance
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      (balances.friendBalances[selectedFriendData.friendId] ||
                        0) >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(
                      Math.abs(
                        balances.friendBalances[selectedFriendData.friendId] ||
                          0
                      ),
                      user?.defaultCurrency || "USD"
                    )}
                    <span className="text-base font-normal text-muted-foreground ml-2">
                      {(balances.friendBalances[selectedFriendData.friendId] ||
                        0) >= 0
                        ? "owes you"
                        : "you owe"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <ArrowRightLeft className="w-4 h-4 mr-2" />
                    Settle Up
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 text-red-600 hover:text-red-600"
                    onClick={() => {
                      removeFriend(selectedFriendData.friendId);
                      setSelectedFriend(null);
                      addToast({ title: "Friend removed", type: "info" });
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
