import { useAuth } from "@/hooks/useAuth";
import { 
  Home, 
  Briefcase, 
  BookOpen, 
  Users, 
  Settings, 
  MessageSquare,
  BarChart3,
  Bell
} from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebars = () => {
  const { user } = useAuth();
  
  // Don't render sidebar for parent role as it has its own integrated sidebar
  if (user?.role === "parent") {
    return null;
  }
  
  const getNavigationItems = () => {
    if (user?.role === "teacher") {
      return [
        { to: "/dashboard/teacher", icon: Home, label: "Dashboard" },
        { to: "/dashboard/teacher/jobs", icon: Briefcase, label: "Jobs" },
        { to: "/dashboard/teacher/my-classes", icon: BookOpen, label: "My Classes" },
        { to: "/dashboard/teacher/tuitions", icon: Users, label: "Tuitions" },
        { to: "/dashboard/teacher/messages", icon: MessageSquare, label: "Messages" },
        { to: "/dashboard/teacher/analytics", icon: BarChart3, label: "Analytics" },
        { to: "/dashboard/teacher/notifications", icon: Bell, label: "Notifications" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
      ];
    }
    
    if (user?.role === "school") {
      return [
        { to: "/dashboard/school", icon: Home, label: "Dashboard" },
        { to: "/dashboard/school/job-openings", icon: Briefcase, label: "Job Openings" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
      ];
    }
    
    if (user?.role === "admin") {
      return [
        { to: "/dashboard/admin", icon: Home, label: "Dashboard" },
        { to: "/dashboard/settings", icon: Settings, label: "Settings" },
      ];
    }
    
    return [];
  };

  const navigationItems = getNavigationItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800">Gravity Portal</h2>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebars;