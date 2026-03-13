import {
  BellDotIcon,
  LucideSettings,
  MapPin,
  LogOut,
  Loader2,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import HeaderFilter from "./HeaderFilter";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { memo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { mutate: logoutUser, isLoading } = logout;

  return (
    <div className="flex font-grotesk flex-col">
      <header className="flex sticky top-0 justify-between items-center bg-black text-white p-4 z-50">
        {/* Left Section (Navigation) */}
        <div className="flex items-center space-x-6">
          <Link
            to="/"
            className="font-xl font-grotesk text-muted border py-2 px-6 bg-foreground rounded-xl font-black tracking-wider w-fit border-x-red-400 border-y-cyan-400 hover:invert cursor-pointer"
          >
            GRAVITY
          </Link>
          {user?.role === "teacher" && (
            <nav className="space-x-4 font-semibold font-grotesk flex items-center">
              <Link to="/dashboard/teacher">Find Teaching Jobs</Link>
              <Link to="/dashboard/teacher/tuitions">Tuition Requests</Link>
            </nav>
          )}
          {user?.role === "school" && (
            <nav className="space-x-4 font-semibold font-grotesk">
              <Link to="/dashboard/school">School Dashboard</Link>
              <Link to="/dashboard/school/job-openings">My Postings</Link>
            </nav>
          )}
          {user?.role === "parent" && (
            <nav className="space-x-4 font-semibold font-grotesk">
              <Link to="/dashboard/parent">Dashboard</Link>
              <Link to="/dashboard/parent/find-tutor">Find Tutors</Link>
            </nav>
          )}
          {user?.role === "admin" && (
            <nav className="space-x-4 font-semibold font-grotesk">
              <Link to="/dashboard/admin">Admin Console</Link>
            </nav>
          )}
        </div>

        {/* Right Section (User Profile, Settings) */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <div className="hidden lg:grid ml-2 grid-flow-col-dense items-center h-fit text-sm">
                <MapPin size={20} className="mr-2" />
                {user?.address}
              </div>

              <Button
                size="icon"
                className="hidden lg:flex items-center rounded-full border border-white"
              >
                <BellDotIcon size={20} />
              </Button>
              <Accordion
                asChild
                type="single"
                collapsible
                className="w-fit h-fit"
              >
                <AccordionItem className="border-b-0" value="user-profile">
                  <AccordionTrigger className="h-11">
                    <Avatar>
                      <AvatarImage
                        src={user?.profilePic}
                        alt={user?.fullName}
                      />
                      <AvatarFallback>
                        {user?.fullName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </AccordionTrigger>
                  <AccordionContent className="absolute top-20 right-1.5 z-50 border-2 border-cyan-300 h-fit pb-0">
                    <div className="grid grid-rows-2 divide-y-2 divide-cyan-300 text-3xl w-40">
                      <Link
                        className={cn(
                          buttonVariants({
                            variant: "default",
                            size: "default",
                          }),
                          "rounded-none gap-2"
                        )}
                        to={user?.role === "recruiter" ? "/dashboard/school/profile" : user?.role === "parent" ? "/dashboard/parent/profile-settings" : "/dashboard/teacher/profile"}
                      >
                        <LucideSettings size={20} /> Settings
                      </Link>
                      <Button
                        disabled={isLoading}
                        onClick={logoutUser}
                        className="rounded-none gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <LogOut />
                        )}
                        Logout
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          ) : (
            <div className="flex flex-row gap-3 font-grotesk">
              <Link
                to="/login"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "font-semibold text-base tracking-wide"
                )}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "font-semibold tracking-wide bg-transparent"
                )}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>
      <Separator className="bg-gray-600" />
      <div className="sticky top-[64px] z-40 bg-foreground">
        <HeaderFilter />
      </div>
    </div>
  );
};

export default memo(Navbar);
