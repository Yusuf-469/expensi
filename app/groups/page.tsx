"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Users,
  Receipt,
  ArrowRight,
  Home,
  Plane,
  Calendar,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, getInitials } from "@/lib/utils";
import { GroupType } from "@/types";

const groupTypeIcons: Record<GroupType, typeof Home> = {
  Trip: Plane,
  Home: Home,
  Event: Calendar,
  Other: MoreHorizontal,
};

const groupTypeColors: Record<GroupType, string> = {
  Trip: "#3B82F6",
  Home: "#8B5CF6",
  Event: "#EC4899",
  Other: "#6B7280",
};

export default function GroupsPage() {
  const { user } = useAuth();
  const { groups, friends, addGroup, deleteGroup, getGroupExpenses } =
    useExpenses();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Create group form state
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState<GroupType>("Other");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (!groupName || !user) return;
    addGroup(groupName, groupType, selectedMembers);
    setGroupName("");
    setGroupType("Other");
    setSelectedMembers([]);
    setIsCreateOpen(false);
  };

  const selectedGroupData = selectedGroup
    ? groups.find((g) => g.id === selectedGroup)
    : null;

  const selectedGroupExpenses = selectedGroup
    ? getGroupExpenses(selectedGroup)
    : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>
            <p className="text-muted-foreground">
              Manage shared expenses with groups
            </p>
          </div>
          <Button
            className="bg-[#1D9C5A] hover:bg-[#157A46]"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Group
          </Button>
        </div>

        {/* Groups Grid */}
        {groups.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No groups yet</h3>
              <p className="text-muted-foreground mb-4">
                Create a group to track shared expenses
              </p>
              <Button
                className="bg-[#1D9C5A] hover:bg-[#157A46]"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => {
              const Icon = groupTypeIcons[group.type];
              const color = groupTypeColors[group.type];
              const groupExpenses = getGroupExpenses(group.id);

              return (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-lg transition-all"
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: color }}
                        >
                          <Icon className="w-6 h-6" />
                        </div>
                        <Badge variant="secondary">{group.type}</Badge>
                      </div>

                      <h3 className="text-lg font-semibold mb-1">
                        {group.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Created {new Date(group.createdAt).toLocaleDateString()}
                      </p>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          <span>{group.members.length} members</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Receipt className="w-4 h-4" />
                          <span>{groupExpenses.length} expenses</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Total expenses
                          </span>
                          <span className="font-semibold">
                            {formatCurrency(
                              groupExpenses.reduce(
                                (sum, e) => sum + e.amount,
                                0
                              ),
                              user?.defaultCurrency || "USD"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Group Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#1D9C5A]" />
              Create Group
            </DialogTitle>
            <DialogDescription>
              Create a group to track shared expenses
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input
                id="name"
                placeholder="e.g., Apartment 4B, Summer Trip..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Group Type</Label>
              <Select
                value={groupType}
                onValueChange={(v) => setGroupType(v as GroupType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trip">Trip</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Add Members</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                {friends.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No friends yet. Add friends first.
                  </p>
                ) : (
                  friends.map((friend) => (
                    <div
                      key={friend.friendId}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                      onClick={() => {
                        setSelectedMembers((prev) =>
                          prev.includes(friend.friendId)
                            ? prev.filter((id) => id !== friend.friendId)
                            : [...prev, friend.friendId]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedMembers.includes(friend.friendId)}
                        onCheckedChange={() => {}}
                      />
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                          {getInitials(friend.friend.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="flex-1">{friend.friend.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-[#1D9C5A] hover:bg-[#157A46]"
              onClick={handleCreateGroup}
              disabled={!groupName}
            >
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Group Detail Dialog */}
      <Dialog
        open={!!selectedGroup}
        onOpenChange={() => setSelectedGroup(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedGroupData && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{
                      backgroundColor: groupTypeColors[selectedGroupData.type],
                    }}
                  >
                    {(() => {
                      const Icon = groupTypeIcons[selectedGroupData.type];
                      return <Icon className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <p>{selectedGroupData.name}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                      {selectedGroupData.type} ·{" "}
                      {selectedGroupData.members.length} members
                    </p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Members */}
                <div>
                  <h4 className="font-medium mb-3">Members</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedGroupData.members.map((member) => (
                      <div
                        key={member.userId}
                        className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted"
                      >
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-[#1D9C5A]/10 text-[#1D9C5A] text-xs">
                            {getInitials(member.user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{member.user.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expenses */}
                <div>
                  <h4 className="font-medium mb-3">
                    Expenses ({selectedGroupExpenses.length})
                  </h4>
                  {selectedGroupExpenses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No expenses in this group yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {selectedGroupExpenses.slice(0, 5).map((expense) => (
                        <div
                          key={expense.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div>
                            <p className="font-medium">{expense.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(
                              expense.amount,
                              expense.currency
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    <Receipt className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-600"
                    onClick={() => {
                      deleteGroup(selectedGroupData.id);
                      setSelectedGroup(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
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
