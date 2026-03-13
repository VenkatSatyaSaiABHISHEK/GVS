import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyNotifications, markAllNotificationsRead, markNotificationRead } from "@/services/notificationServices";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Check,
  BookOpen,
  MessageSquare,
  Briefcase,
  DollarSign,
  Star,
  AlertCircle,
  Calendar,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const NotificationIcons = {
  application_status: <Briefcase size={18} className="text-purple-500" />,
  shortlisting: <Check size={18} className="text-indigo-500" />,
  interview: <Calendar size={18} className="text-cyan-500" />,
  offer: <DollarSign size={18} className="text-green-500" />,
  message: <MessageSquare size={18} className="text-orange-500" />,
  job_alert: <Briefcase size={18} className="text-purple-500" />,
  profile_view: <Eye size={18} className="text-yellow-500" />,
  tuition_request: <BookOpen size={18} className="text-blue-500" />,
  review_received: <Star size={18} className="text-yellow-500" />,
  warning: <AlertCircle size={18} className="text-red-500" />,
  general: <Bell size={18} className="text-gray-500" />,
};

const NotificationsPanel = () => {
  const queryClient = useQueryClient();

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getMyNotifications,
    refetchInterval: 30000,
  });

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    onError: () => toast.error("Failed to mark as read"),
  });

  const readAllMutation = useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => queryClient.invalidateQueries(["notifications"]),
    onError: () => toast.error("Failed to mark all as read"),
  });

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  const notifications = notifData?.notifications || [];
  const unreadCount = notifData?.unreadCount || 0;
  const unreadNotifications = notifications.filter((notification) => !notification.isRead);

  return (
    <div className="space-y-6 lg:p-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell size={28} /> Notifications
          </h2>
          <p className="text-muted-foreground mt-1">
            You have <span className="font-bold">{unreadCount}</span> unread notification{unreadCount !== 1 ? "s" : ""}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={() => readAllMutation.mutate()}>
            <Check size={16} /> Mark All as Read
          </Button>
        )}
      </div>

      {unreadNotifications.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground px-2">Unread</h3>
          {unreadNotifications.map((notification) => (
            <Card
              key={notification.id}
              className="border-2 cursor-pointer transition-all hover:shadow-md"
              onClick={() => readMutation.mutate(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">{NotificationIcons[notification.type] || NotificationIcons.general}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      </div>
                      <Badge variant="default" className="flex-shrink-0">New</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {notifications.filter((notification) => notification.isRead).length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground px-2">Earlier</h3>
          {notifications
            .filter((notification) => notification.isRead)
            .map((notification) => (
              <Card key={notification.id} className="border opacity-75 hover:opacity-100 transition-opacity">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 opacity-60">{NotificationIcons[notification.type] || NotificationIcons.general}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {notifications.length === 0 && (
        <Card className="py-20 text-center border-dashed">
          <CardContent>
            <Bell size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationsPanel;
