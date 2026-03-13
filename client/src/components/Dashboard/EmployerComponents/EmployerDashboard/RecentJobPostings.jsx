import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PropTypes from "prop-types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import ApplicantsDrawer from "../common/ApplicationDrawer";

const RecentJobPostings = ({ recentJobs }) => {
  const [openStates, setOpenStates] = useState({});
  const { user } = useAuth();
  const handleSetOpen = (jobId, isOpen) => {
    setOpenStates((prev) => ({ ...prev, [jobId]: isOpen }));
  };
  const isBookmarked = (jobId) => {
    return (
      user?.bookmarkedJobs?.some(
        (bookmarkedJob) => bookmarkedJob?.id === jobId
      ) || false
    );
  };
  return (
    <Card className="rounded-3xl overflow-y-auto h-96 lg:h-full shadow-xl scrollbar-thin scrollbar-rounded scrollbar-track-muted scrollbar-thumb-foreground">
      <CardHeader className="sticky top-0">
        <CardTitle>Recent Job Postings</CardTitle>
        <CardDescription>Overview of your latest job listings</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-flow-row-dense gap-2">
          {recentJobs?.map((job) => (
            <div key={job.id}>
              <li
                className="flex bg-muted rounded-3xl py-4 px-6 border items-center justify-between cursor-pointer hover:bg-muted/20"
                onClick={() => handleSetOpen(job.id, true)}
              >
                <div>
                  <p className="font-medium">{job.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {job.company.name} - {job.location.city},{" "}
                    {job.location.country}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {job.applicants.length} applicant(s)
                  </p>
                </div>
                <Badge variant="default">Open</Badge>
              </li>
              <ApplicantsDrawer
                open={openStates[job?.id] || false}
                setOpen={(isOpen) => handleSetOpen(job.id, isOpen)}
                job={job}
                isBookmarked={isBookmarked(job?.id)}
              />
            </div>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

RecentJobPostings.propTypes = {
  recentJobs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      company: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        logo: PropTypes.string,
      }).isRequired,
      location: PropTypes.shape({
        city: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
      }).isRequired,
      applicants: PropTypes.arrayOf(PropTypes.string).isRequired,
      postedAt: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecentJobPostings;
