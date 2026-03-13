import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  UserRoundPlus,
  Loader2,
  ArrowLeft,
  Home,
  NotepadText,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PostAJobButton from "../../EmployerComponents/PostAJobButton";
import { profileMenu } from "@/constants/constants.jsx";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"; // Added missing imports

import { useState } from "react";
import { generateInviteCode } from "@/services/invitecodeServices";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SettingsSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isSchool = user?.role === "school";
  const isAdmin = user?.role === "admin";
  const isManagement = isSchool || isAdmin;
  const isRecruiter = isSchool; // School is the recruiter role
  const isSettingsPage = location.pathname.startsWith("/dashboard/settings");
  const isRecruiterDashboard = location.pathname.startsWith("/dashboard/school");

  const renderBackButton = () => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        onClick={() => { const roleMap = { jobSeeker: 'teacher', recruiter: 'school', teacher: 'teacher', school: 'school', parent: 'parent', admin: 'admin' }; navigate(`/dashboard/${roleMap[user?.role] || user?.role}`); }}
        className="group transition-all flex items-center justify-center w-full px-1.5 lg:px-4 py-2 text-center border rounded-full hover:bg-white hover:invert"
      >
        <ArrowLeft
          className="transition-all duration-500 ease-in-out group-hover:-translate-x-2 lg:mr-2"
          size={30}
        />
        <span className="hidden lg:block">Back</span>
      </Button>
    </motion.div>
  );

  const renderNavLink = (to, icon, label) => {
    const isActive = location.pathname === to;
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
        key={to}
      >
        <Link
          to={to}
          className={`flex items-center justify-center w-10 h-10 lg:w-full p-2.5 lg:px-4 lg:py-2 text-sm border rounded-full transition-all ${isActive ? "bg-cyan-400/20" : "bg-white"
            }`}
        >
          <span className="lg:mr-2">{icon}</span>
          <span className="hidden lg:block">{label}</span>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="lg:space-y-4 lg:py-2 overflow-x-scroll lg:overflow-visible flex flex-row lg:flex-col gap-2 px-6 lg:px-1 lg:justify-start items-center lg:items-start h-fit lg:w-full lg:h-full lg:min-h-full">
      {isSettingsPage
        ? renderBackButton()
        : isRecruiterDashboard && <PostAJobButton />}

      <div className=" lg:w-full items-center ">
        <div className="flex px-1 lg:px-1 flex-row lg:flex-col min-h-full border rounded-3xl w-fit lg:min-w-full space-x-1.5 lg:space-x-0 lg:space-y-2 p-1 bg-cyan-300/20 lg:p-3 gap-0.5 lg:gap-0 font-semibold overflow-hidden lg:overflow-clip z-20">
          {(isRecruiter || isAdmin) && (
            <>
              {renderNavLink(`/dashboard/${{ jobSeeker: 'teacher', recruiter: 'school', teacher: 'teacher', school: 'school', parent: 'parent', admin: 'admin' }[user.role] || user.role}`, <Home />, "Dashboard")}
            </>
          )}
          {isRecruiter && (
            <>
              {renderNavLink(
                "/dashboard/school/job-openings",
                <NotepadText />,
                "Job Postings"
              )}
            </>
          )}
          {profileMenu.map((item) =>
            renderNavLink(item.path, item.icon, item.name)
          )}
          {(isManagement || isAdmin) && <InviteCodeGenerator />}
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;

export function InviteCodeGenerator() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("teacher");
  const [inviteCode, setInviteCode] = useState(""); // State to hold the generated invite code
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { mutate: generateCode, isLoading } = useMutation({
    mutationFn: generateInviteCode,
    onSuccess: (data) => {
      // Receive data on success
      toast.success("Invite code generated successfully!", {
        description: `An invite code has been sent to ${email}.`,
      });
      setInviteCode(data.inviteCode); // Set the invite code received from the response
    },
    onError: (error) => {
      toast.error("Failed to generate invite code", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateCode({ email, role }); // Call the mutation with the email and role
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          title="Generate Invite Code"
          variant=""
          size={isMobile ? "icon" : "lg"}
          className="bg-cyan-300 border-2 xl:mt-2 border-white text-primary font-bold rounded-3xl flex items-center"
        >
          <UserRoundPlus className="lg:mr-2" />
          <span className="hidden lg:block">Invite</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Generate Invite Code</SheetTitle>
          <SheetDescription>
            Create an invite code for a new user. The code will be sent to their
            email.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teacher" id="teacher" />
                <Label htmlFor="teacher">Teacher</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="school" id="school" />
                <Label htmlFor="school">School</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="parent" id="parent" />
                <Label htmlFor="parent">Parent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="admin" />
                <Label htmlFor="admin">Admin</Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Invite Code"
            )}
          </Button>
        </form>
        {inviteCode && ( // Show the invite code input if it exists
          <div className="space-y-2">
            <Label>Generated Invite Code</Label>
            <div className="flex items-center">
              <Input
                type="text"
                value={inviteCode}
                readOnly
                disabled
                className="bg-gray-200" // Optional styling for the disabled input
              />
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/register?inviteCode=${inviteCode}`
                  );
                  toast.success("Invite code copied to clipboard!");
                }}
                className="ml-2"
              >
                <Copy />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
