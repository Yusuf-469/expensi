"use client";

import { motion } from "framer-motion";
import {
  Receipt,
  UserPlus,
  HandCoins,
  Users,
  FolderOpen,
  Check,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppLayout } from "@/components/expensi/AppLayout";
import { useExpenses } from "@/contexts/ExpenseContext";
import { formatCurrency, formatRelativeDate, getInitials } from "@/lib/utils";
import { ActivityType } from "@/types";

const activityIcons: Record<ActivityType, typeof Receipt> = {
  expense_created: Receipt,
  expense_updated: Receipt,
  expense_deleted: Receipt,
  settlement: HandCoins,
  friend_added: UserPlus,
  group_created: FolderOpen,
  group_joined: Users,
  comment: Receipt,
};

const activityColors: Record<ActivityType, string> = {
  expense_created: "#1D9C5A",
  expense_updated: "#3B82F6",
  expense_deleted: "#EF4444",
  settlement: "#8B5CF6",
  friend_added: "#EC4899",
  group_created: "#F97316",
  group_joined: "#14B8A6",
  comment: "#6B7280",
};

export default function ActivityPage() {
  const { activities, notifications, markNotificationRead, markAllNotificationsRead, deleteNotification } =
    useExpenses();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Activity</h1>
            <p className="text-muted-foreground">
              Track all your recent activities and notifications
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={markAllNotificationsRead}>
              <Check className="w-4 h-4 mr-2" />
              Mark all read
            </Button>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Notifications */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge variant="destructive">{unreadCount} new</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            notification.read
                              ? "bg-background"
                              : "bg-[#1D9C5A]/5 border-[#1D9C5A]/20"
                          }`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                notification.read
                                  ? "bg-gray-300"
                                  : "bg-[#1D9C5A]"
                              }`}
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {formatRelativeDate(notification.createdAt)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  {activities.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                        <span className="text-3xl">📋</span>
                      </div>
                      <h3 className="text-lg font-medium mb-2">
                        No activity yet
                      </h3>
                      <p>Your recent activities will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity, index) => {
                        const Icon = activityIcons[activity.type];
                        const color = activityColors[activity.type];

                        return (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-start gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                          >
                            <div
                              className="w-10 h-10 rounded-full flex items-center justify-center text-white shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback
                                    className="text-xs"
                                    style={{
                                      backgroundColor: `${color}20`,
                                      color: color,
                                    }}
                                  >
                                    {getInitials(activity.user.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium">
                                  {activity.user.name}
                                </span>
                                <span className="text-muted-foreground">
                                  {activity.description}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatRelativeDate(activity.createdAt)}
                              </p>
                            </div>
                            {activity.metadata?.amount && (
                              <Badge variant="secondary" className="shrink-0">
                                {formatCurrency(
                                  activity.metadata.amount,
                                  activity.metadata.currency || "USD"
                                )}
                              </Badge>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
