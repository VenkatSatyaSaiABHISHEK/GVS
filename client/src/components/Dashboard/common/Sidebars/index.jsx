import { Suspense, lazy, memo } from "react";
import SettingsSidebar from "./SettingsSidebar";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Filters = lazy(() => import("../../Filters"));
import { SlidersVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/useFilters";

const Sidebars = () => {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useAuth();
  const { clearFilters } = useFilters();

  const renderSidebar = () => {
    if (user?.role === "teacher" && pathname === "/dashboard/teacher") {
      // Don't render filter sidebar for teacher dashboard overview
      return null;
    } else if (
      pathname.startsWith("/dashboard/school") ||
      pathname.startsWith("/dashboard/admin") ||
      pathname.startsWith("/dashboard/settings")
    ) {
      return <SettingsSidebar />;
    }
    return null;
  };

  return (
    <Suspense fallback={`Loading....`}>
      {renderSidebar() && (
        <Card
          className={`fixed lg:sticky bottom-0 inset-x-2 lg:w-56 h-fit lg:min-h-full my-2 lg:h-full max-h-full py-0.5 lg:p-0 lg:ml-2 rounded-3xl bg-muted shadow-md z-50 overflow-auto`}
        >
          <CardContent className="p-0 min-h-full h-full mx-1">
            {renderSidebar()}
          </CardContent>
        </Card>
      )}
    </Suspense>
  );
};

export default memo(Sidebars);
