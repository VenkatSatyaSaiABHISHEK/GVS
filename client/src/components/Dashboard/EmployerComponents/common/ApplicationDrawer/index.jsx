import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import ApplicantCard from "./ApplicantCard";
import { Badge } from "@/components/ui/badge";
import BookmarkButton from "../../../common/JobCard/BookmarkButton";
import PropTypes from "prop-types";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobApplications } from "@/services/applicationServices";
import moment from "moment";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const ApplicantsDrawer = ({ job, isBookmarked, open, setOpen }) => {
  const { id, title, location, company, postedAt, combinedField } = job;
  const {
    data: applicants,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["job-applications", id],
    queryFn: () => getJobApplications(id),
    enabled: !!id && open,
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className="h-[calc(100vh-1vh)] px-4 lg:px-28 max-w-screen bg-background">
        <DrawerHeader
          className={`w-full bg-transparent h-fit font-grotesk p-0 px-1 my-2 lg:px-20`}
        >
          <div className="grid lg:grid-cols-2 w-full">
            <div className="grid order-2 lg:order-1 grid-flow-row-dense justify-start">
              <DrawerTitle className="text-2xl mt-4 lg:text-4xl">
                {title}
              </DrawerTitle>
              <div className="flex lg:flex-row items-center">
                <div className="mr-4 p-1">
                  <Avatar>
                    <AvatarImage src={company?.logo} alt={company?.name} />
                    <AvatarFallback>{company?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-blue-600 text-center font-bold">
                    {company?.name}
                  </div>
                </div>
                <div className="lg:grid space-y-1 lg:grid-row-2 lg:items-center w-fit">
                  <Badge
                    className={`text-xs lg:text-sm capitalize rounded-full px-2 py-1 bg-white/70 border shadow-xl text-center align-center w-fit flex flex-row items-center lg:py-2 lg:px-3 font-bold text-blacks`}
                  >
                    <span>
                      <MapPin className="w-4 h-4 mr-2" />
                    </span>
                    <span>
                      {location?.city},{location?.state}
                    </span>
                  </Badge>

                  <div className="flex capitalize flex-wrap gap-1 w-fit">
                    <Badge className="text-xs rounded-full px-2 py-1 bg-white/70 border shadow-xl text-center align-center w-fit flex flex-row  items-center lg:py-2 lg:px-3 font-bold text-black">
                      <span>
                        <Clock className="w-4 h-4 align-baseline mr-2" />
                      </span>
                      <span>{moment(postedAt).fromNow()}</span>
                    </Badge>
                    {combinedField &&
                      Object.values(combinedField)?.map((skill) => (
                        <Badge key={skill} className="rounded-full text-xs">
                          {skill}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="grid mt-4 order-1 lg:order-2 justify-end gap-1 lg:gap-5 grid-flow-col-dense">
              <div className="rounded-sm border h-fit bg-background">
                <BookmarkButton jobId={id} isBookmarked={isBookmarked} />
              </div>
            </div>
          </div>
        </DrawerHeader>
        <div className="overflow-y-auto text-md text-black scrollbar-thin scrollbar-thumb-rounded-full w-full font-medium font-grotesk mx-auto scrollbar-thumb-gray-400 min-h-full my-4">
          {isLoading ? (
            <div className="grid lg:grid-cols-2 gap-4">
              {Array.from({ length: 10 }, (_, index) => (
                <Skeleton
                  className={
                    "border flex flex-col justify-evenly h-56 px-4 py-6 space-y-4"
                  }
                  key={index}
                >
                  <Skeleton className={"rounded-full h-11 w-11 bg-black/20"} />
                  <Skeleton className={"rounded-full h-8 w-full bg-black/20"} />
                  <Skeleton className={"rounded-full h-8 w-full bg-black/20"} />
                </Skeleton>
              ))}
            </div>
          ) : applicants?.length > 0 ? (
            <div className="grid xl:grid-cols-3 gap-4">
              {applicants?.map((application) => (
                <ApplicantCard
                  key={application.id}
                  application={application}
                />
              ))}
            </div>
          ) : (
            <div className="border-dashed border-4 text-center flex flex-col justify-center items-center h-56 min-w-full rounded-3xl">
              No Applicants
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

ApplicantsDrawer.propTypes = {
  isBookmarked: PropTypes.bool.isRequired,
  job: PropTypes.shape({
    id: PropTypes.string.isRequired,
    company: PropTypes.shape({
      name: PropTypes.string.isRequired,
      logo: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    }).isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    location: PropTypes.shape({
      city: PropTypes.string,
      state: PropTypes.string,
      country: PropTypes.string,
    }),
    postedAt: PropTypes.string.isRequired,
    combinedField: PropTypes.shape({
      requiredSkills: PropTypes.string,
      jobType: PropTypes.string,
      workFrom: PropTypes.string,
      experience: PropTypes.string,
    }),
  }).isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default ApplicantsDrawer;
