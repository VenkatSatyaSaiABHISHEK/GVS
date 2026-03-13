import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import BookmarkButton from "./BookmarkButton";
import { Clock } from "lucide-react";
import PropTypes from "prop-types";
import { formatSalary } from "@/lib/utils";
import { memo } from "react";
import moment from "moment";

const JobCard = ({ job, isBookmarked, children }) => {
  const {
    id,
    company,
    title,
    subject,
    location,
    salaryRange,
    frequency,
    skillsRequired,
    status,
    postedAt,
    combinedField,
  } = job;

  return (
    <>
      <div className="p-2 mx-auto capitalize font-grotesk border-l-8 border-l-gray-400 border border-input bg-white border-black max-h-[360px] hover:border hover:border-r-8 hover:shadow-lg transition-all rounded-3xl w-[90%] sm:w-64 md:w-72 lg:w-80 min-h-[350px] justify-around group space-y-2 bg-muted flex flex-col">
        <div
          className={`${status === "open" ? "bg-cyan-200" : "bg-slate-500"
            } border-2 border-black/10 h-4/5 min-h-[80%] max-h-[80%] rounded-2xl p-4 w-full flex flex-col relative justify-between"`}
        >
          <div
            className={`${status === "open" ? "hidden " : "block "
              } absolute -rotate-45 inset-y-1/3 font-grotesk group-hover:hidden text-7xl bg-black duration-700 transition-all rounded-xl px-4 py-2 text-red-600 font-semibold`}
          >
            Closed!!
          </div>
          <div className="flex flex-row justify-between items-center">
            <span className="text-sm rounded-full bg-white/70 border-border shadow-xl text-center align-center w-fit flex flex-row items-center py-2 px-3 font-bold text-black">
              <span>
                <Clock className="w-4 h-4 align-baseline mr-2" />
              </span>
              <span>{moment(postedAt).fromNow()}</span>
            </span>
            <div
              title={isBookmarked ? "Unbookmark" : "Bookmark"}
              className="h-10 w-10 border-2 rounded-full border-white"
            >
              <BookmarkButton isBookmarked={isBookmarked} jobId={id} />
            </div>
          </div>
          <div className="mt-2 flex flex-row items-center justify-between">
            <div>
              <p className="font-bold text-primary">{subject}</p>
              <h3 className="text-ellipsis line-clamp-2 overflow-hidden text max-h-20 w-full text-2xl font-bold font-grotesk tracking-normal leading-none">
                {title}
              </h3>
              <p className="text-xs font-semibold text-gray-500">{company.name}</p>
            </div>
            <Avatar>
              <AvatarImage src={company?.logo} />
              <AvatarFallback>{company?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex h-1/2 justify-stretch overflow-hidden flex-row flex-wrap gap-1 py-4 font-grotesk font-bold">
            {skillsRequired &&
              Object.values(combinedField)?.map((skill) => (
                <Badge
                  key={skill}
                  className="px-3 !font-grotesk font-bold  py-2 border border-black h-fit shadow-sm rounded-full tracking-wider leading-none text-xs max-w-[40%] truncate overflow-hidden whitespace-nowrap"
                >
                  {skill}
                </Badge>
              ))}
          </div>
        </div>
        <div className="px-2.5 items-center flex flex-row justify-between">
          <div className="mr-2 p-0.5 break-words text-wrap overflow-hidden grid grid-flow-row leading-none truncate">
            <div className="font-bold h-fit text-gray-700">
              {formatSalary(salaryRange?.min)} -{" "}
              {formatSalary(salaryRange?.max)} / {frequency}
            </div>
            <div className="text-gray-400 h-fit font-bold  text-sm">
              {location?.city}, {location?.state}
            </div>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

JobCard.propTypes = {
  children: PropTypes.node,
  isBookmarked: PropTypes.bool.isRequired,
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    company: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    qualificationRequired: PropTypes.string,
    description: PropTypes.string.isRequired,
    location: PropTypes.shape({
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      country: PropTypes.string.isRequired,
    }).isRequired,
    salaryRange: PropTypes.shape({
      min: PropTypes.string.isRequired,
      max: PropTypes.string.isRequired,
    }).isRequired,
    /* applicants: PropTypes.shape({
      id: PropTypes.string,
      profilePic: PropTypes.string, // Added profilePic to PropTypes
      fullName: PropTypes.string,
      bio: PropTypes.string,
      skills: PropTypes.arrayOf(PropTypes.string),
      experience: PropTypes.arrayOf(
        PropTypes.shape({
          jobTitle: PropTypes.string,
          employer: PropTypes.string,
          startDate: PropTypes.string,
          endDate: PropTypes.string,
          description: PropTypes.string,
        })
      ),
    }), */
    tags: PropTypes.arrayOf(PropTypes.string),
    frequency: PropTypes.string.isRequired,
    skillsRequired: PropTypes.string,
    status: PropTypes.string,
    postedAt: PropTypes.string.isRequired,
    combinedField: PropTypes.shape({
      requiredSkills: PropTypes.string,
      jobType: PropTypes.string,
      workFrom: PropTypes.string,
      experience: PropTypes.string,
    }).isRequired,
  }).isRequired,
};

export default memo(JobCard);
