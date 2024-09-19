"use client";

import React, { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Bell,
  MessageSquare,
  Heart,
  Star,
  BookmarkMinus,
  X,
  Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import echo from "@/echo.js";
import { useAuth } from "@/contexts/AuthContext";
import {
  ApigetNotifications,
  ApiMarkNotificationAsRead,
  ApideleteNotification,
} from "@/services/notificationsApi";
import { toast } from "react-toastify";

export function NotificationsDropdown() {
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [deletingIds, setDeletingIds] = useState([]);
  const [displayCount, setDisplayCount] = useState(4);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchNotifications = async () => {
    const response = await ApigetNotifications();
    console.log(response.data);
    setNotifications(response.data);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const NotificationsDing = () => {
    const audio = new Audio("/sounds/Notifications.mp3");
    audio.volume = 0.3;
    audio.loop = false;
    audio.play();
  };

  useEffect(() => {
    if (loading) return;
    // Listen for new comments on the public channel
    const channel = echo.channel(`notifications_channel`);

    channel.listen("NotificationsEvent", (e) => {
      console.log(e);
      console.log(user);
      // setData((prevComments) => [...prevComments, e.message]);
      if (e.notification.creator_id === user.id) {
        setNotifications((prevComments) => [
          e.notification.notification,
          ...prevComments,
        ]);
        NotificationsDing();
        toast.success(
          `${e.notification.notification.comment_user.first_name} ${e.notification.notification.comment_user.last_name} commented on your story.`,
          {
            icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
          }
        );
      } else {
        return channel.stopListening(`notifications_channel`);
      }
    });

    return () => {
      channel.stopListening(`notifications_channel`);
    };
  }, [user]);

  const handleDeleteNotification = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    setDeletingIds((prev) => [...prev, id]);
    try {
      const response = await ApideleteNotification(id);
      if (response.status === 200) {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
        setDeletingIds((prev) =>
          prev.filter((deletingId) => deletingId !== id)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />;
      case "feature":
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getNotificationText = (notification) => {
    const { first_name, last_name } = notification.comment_user;
    switch (notification.notification_type) {
      case "comment":
        return `${first_name} ${last_name} commented on your story`;
      case "like":
        return `${first_name} ${last_name} liked your story`;
      case "feature":
        return `Your story was featured`;
      default:
        return "";
    }
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  const handleViewMore = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const handleMarkAllAsRead = async (e) => {
    setIsDeleting(true);
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await ApiMarkNotificationAsRead();
      if (response.status === 200) {
        setNotifications([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRouteToNotification = (e, notification) => {
    console.log(notification);
    e.preventDefault();
    e.stopPropagation();

    const url = `/explore/${notification.story_id}`;

    window.location.href = url;
  };

  return (
    <DropdownMenu onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full bg-transparent w-9 h-9"
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications menu</span>
          {!isOpen && notifications.length > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${
          !notifications ? "w-80" : "w-80 h-30"
        } rounded-xl bg-background p-1`}
      >
        <DropdownMenuLabel className="font-normal">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            You have {notifications.length} unread notification
            {notifications.length !== 1 ? "s" : ""}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea
          className={`${
            notifications.length === 0 ? "h-[0px]" : "h-[300px]"
          } overflow-y-auto`}
        >
          {notifications.slice(0, displayCount).map((notification) => (
              <DropdownMenuItem
                onClick={(e) => handleRouteToNotification(e, notification)}
                key={notification.id}
                className="flex items-start gap-4 p-3 cursor-pointer"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={
                      notification.comment_user.profile_photo ||
                      "/assets/placeholder-user.jpg"
                    }
                    alt={`${notification.comment_user.first_name} ${notification.comment_user.last_name}`}
                  />
                  <AvatarFallback>
                    {notification.comment_user.first_name[0]}
                    {notification.comment_user.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {getNotificationText(notification)}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getNotificationIcon(notification.notification_type)}
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(notification.created_at)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => handleDeleteNotification(e, notification.id)}
                  disabled={deletingIds.includes(notification.id)}
                >
                  {deletingIds.includes(notification.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {deletingIds.includes(notification.id)
                      ? "Deleting notification"
                      : "Delete notification"}
                  </span>
                </Button>
              </DropdownMenuItem>
          ))}

          {notifications.length > displayCount && (
            <DropdownMenuItem
              className="text-center cursor-pointer justify-center text-sm text-muted-foreground"
              onClick={(e) => handleViewMore(e)}
            >
              View ({notifications.length - displayCount}) more notifications
            </DropdownMenuItem>
          )}
        </ScrollArea>
        {notifications.length === 0 && (
          <p className="p-3 text-sm text-muted-foreground">No notifications</p>
        )}

        {notifications.length !== 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer gap-2 p-3"
              onClick={handleMarkAllAsRead}
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkMinus className="h-4 w-4" />
              )}
              Mark all as read
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
