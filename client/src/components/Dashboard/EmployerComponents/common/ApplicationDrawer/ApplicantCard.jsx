import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Briefcase, CalendarIcon, SquarePen, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";
import moment from "moment";
import { useState } from "react";
import CandidateStatus from "../../common/CandidateStatus";

const ApplicantCard = ({ application }) => {
  const { applicant, status, appliedAt } = application;
  const [openStates, setOpenStates] = useState({});
  const statusColors = {
    applied: "bg-applied",
    reviewing: "bg-reviewing",
    interviewing: "bg-interview",
    hired: "bg-hired",
    rejected: "bg-rejected",
  };

  const handleSetOpen = (userId, isOpen) => {
    setOpenStates((prev) => ({ ...prev, [userId]: isOpen }));
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex flex-row justify-around items-center space-x-3">
            <Avatar>
              <AvatarImage
                src={applicant?.profilePic}
                alt={applicant?.fullName}
              />
              <AvatarFallback>
                {applicant?.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{applicant?.fullName}</CardTitle>
              <CardDescription>{applicant?.address}</CardDescription>
            </div>
          </div>
          <Badge
            onClick={() => handleSetOpen(applicant.id, true)}
            className={`${statusColors[status]} text-white`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}{" "}
            <SquarePen size={20} className="ml-2" />
          </Badge>
          <CandidateStatus
            open={openStates[applicant.id] || false}
            setOpen={(isOpen) => handleSetOpen(applicant.id, isOpen)}
            candidateId={applicant.id}
            applicationId={application.id}
            status={application.status}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="flex items-center">
            <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
            <span>{applicant?.yoe}</span>
          </div>
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
            <span>{moment(appliedAt).format("MMM DD, YYYY")}</span>
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {applicant.skills
              ?.join(", ")
              .split(", ")
              .map((skill, index) => (
                <Badge key={index} variant="secondary" className="rounded-full">
                  {skill}
                </Badge>
              ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 rounded-xl"
              onClick={() => {
                if (applicant?.resumeUrl) {
                  window.open(applicant.resumeUrl, "_blank");
                }
              }}
              disabled={!applicant?.resumeUrl}
            >
              <Download size={16} /> Resume
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 rounded-xl"
              onClick={() => {
                window.location.href = `mailto:${applicant?.contactEmail || applicant?.email}`;
              }}
            >
              <Mail size={16} /> Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

ApplicantCard.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.string,
    appliedAt: PropTypes.string,
    status: PropTypes.string,
    applicant: PropTypes.shape({
      id: PropTypes.string,
      profilePic: PropTypes.string, // Added profilePic to PropTypes
      fullName: PropTypes.string,
      yoe: PropTypes.string,
      bio: PropTypes.string,
      contact: PropTypes.string,
      contactEmail: PropTypes.string,
      designation: PropTypes.string,
      address: PropTypes.string,
      skills: PropTypes.arrayOf(PropTypes.string),
      projects: PropTypes.arrayOf(
        PropTypes.shape({
          title: PropTypes.string,
          description: PropTypes.string,
          skills: PropTypes.arrayOf(PropTypes.string),
          endDate: PropTypes.string,
          url: PropTypes.string, // Made optional
        })
      ),
      experience: PropTypes.arrayOf(
        PropTypes.shape({
          jobTitle: PropTypes.string,
          employer: PropTypes.string,
          startDate: PropTypes.string,
          endDate: PropTypes.string,
          description: PropTypes.string,
        })
      ),
      education: PropTypes.arrayOf(
        PropTypes.shape({
          institution: PropTypes.string,
          degree: PropTypes.string,
          yearOfGraduation: PropTypes.string,
        })
      ),
    }),
  }),
};

export default ApplicantCard;
