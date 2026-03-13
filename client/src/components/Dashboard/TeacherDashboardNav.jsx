import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard, Briefcase, BookOpen, Calendar, Users, DollarSign,
    Bell, FileText, Bookmark, BarChart3, Settings
} from "lucide-react";

const TeacherDashboardNav = () => {
    const location = useLocation();

    const menuItems = [
        {
            title: "Overview",
            href: "/dashboard/teacher",
            icon: LayoutDashboard,
            description: "Dashboard overview & quick stats"
        },
        {
            title: "Job Opportunities",
            href: "/dashboard/teacher/jobs",
            icon: Briefcase,
            description: "Browse and apply for jobs"
        },
        {
            title: "Tuition Requests",
            href: "/dashboard/teacher/tuitions",
            icon: BookOpen,
            description: "Manage parent tuition requests"
        },
        {
            title: "Demo Classes",
            href: "/dashboard/teacher/demo-classes",
            icon: Calendar,
            description: "Schedule demo sessions"
        },
        {
            title: "Active Students",
            href: "/dashboard/teacher/active-students",
            icon: Users,
            description: "Manage ongoing students"
        },
        {
            title: "Earnings",
            href: "/dashboard/teacher/earnings",
            icon: DollarSign,
            description: "View income & earnings"
        },
        {
            title: "Notifications",
            href: "/dashboard/teacher/notifications",
            icon: Bell,
            description: "All notifications"
        },
        {
            title: "Applied Jobs",
            href: "/dashboard/teacher/applied-jobs",
            icon: FileText,
            description: "Your job applications"
        },
        {
            title: "Saved Jobs",
            href: "/dashboard/teacher/bookmarks",
            icon: Bookmark,
            description: "Your bookmarked jobs"
        }
    ];

    const isActive = (href) => {
        return location.pathname === href || location.pathname.startsWith(href + "/");
    };

    return (
        <nav className="space-y-2">
            {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                    <Link
                        key={item.href}
                        to={item.href}
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group",
                            active
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                    >
                        <Icon size={20} className={cn("flex-shrink-0", active && "text-current")} />
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{item.title}</p>
                            <p className={cn(
                                "text-xs truncate",
                                active ? "text-primary-foreground/80" : "text-muted-foreground/70"
                            )}>
                                {item.description}
                            </p>
                        </div>
                    </Link>
                );
            })}

            {/* Divider */}
            <div className="my-4 h-px bg-border" />

            {/* Settings */}
            <Link
                to="/dashboard/teacher/profile"
                className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    location.pathname.startsWith("/dashboard/teacher/profile") || location.pathname.startsWith("/dashboard/teacher/settings")
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
            >
                <Settings size={20} />
                <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">Settings & Profile</p>
                    <p className="text-xs text-muted-foreground/70">Edit profile & preferences</p>
                </div>
            </Link>
        </nav>
    );
};

export default TeacherDashboardNav;
