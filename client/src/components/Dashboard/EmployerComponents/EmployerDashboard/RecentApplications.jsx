import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import PropTypes from "prop-types";
import CandidateStatus from "../common/CandidateStatus";
import { SquarePen } from "lucide-react";
import { useState } from "react";

const RecentApplications = ({ recentApplications, onSelectApplicant }) => {
  const [openStates, setOpenStates] = useState({});
  const handleSetOpen = (userId, isOpen) => {
    setOpenStates((prev) => ({ ...prev, [userId]: isOpen }));
  };
  return (
    <Card
      title="recent applications"
      className="rounded-3xl overflow-y-auto  shadow-xl scrollbar-thin scrollbar-rounded scrollbar-track-muted scrollbar-thumb-foreground"
    >
      <CardHeader className="sticky top-0">
        <CardTitle>Recent Applications</CardTitle>
        <CardDescription>Latest candidate applications</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-flow-row-dense gap-2">
          {recentApplications.map((app) => (
            <div key={app.id}>
              <li className="flex bg-muted rounded-3xl py-4 px-6 border items-center justify-between hover:bg-muted/20">
                <div
                  className="cursor-pointer"
                  onClick={() => onSelectApplicant(app.applicant.id)}
                >
                  <p className="font-medium">{app.applicant.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.job.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge
                  onClick={() => handleSetOpen(app.applicant.id, true)}
                  className="cursor-pointer"
                  variant={
                    app.status === "applied"
                      ? "default"
                      : app.status === "reviewing"
                      ? "secondary"
                      : "outline"
                  }
                >
                  {app.status}
                  <SquarePen size={20} className="ml-2" />
                </Badge>
              </li>
              <CandidateStatus
                open={openStates[app.applicant.id] || false}
                setOpen={(isOpen) => handleSetOpen(app.applicant.id, isOpen)}
                candidateId={app.applicant.id}
                applicationId={app.id}
                status={app.status}
              />
            </div>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

RecentApplications.propTypes = {
  onSelectApplicant: PropTypes.func,
  recentApplications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      applicant: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
      }).isRequired,
      job: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }).isRequired,
      appliedAt: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecentApplications;
