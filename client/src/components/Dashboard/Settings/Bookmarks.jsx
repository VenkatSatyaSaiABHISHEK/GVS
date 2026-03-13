import { Briefcase, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import BookmarkButton from "../common/JobCard/BookmarkButton";
import Container from "../common/Container";
import Loader from "../common/Loader";
import { formatSalary } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const Bookmarks = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Loader />;

  return (
    <Container
      className={`max-w-screen-2xl overflow-auto capitalize font-semibold w-full lg:w-full lg:px-20 lg:mx-6 max-h-full min-h-full bg-background lg:py-12`}
    >
      <div className="container min-h-full mx-auto p-4">
        <h1 className="text-xl rounded-full bg-primary text-background py-2 px-4 font-bold mb-4">
          Bookmarked Jobs ({user?.bookmarkedJobs?.length})
        </h1>
        <div className="grid lg:grid-cols-3 gap-4">
          {user?.bookmarkedJobs?.map((job) => (
            <Card key={job.id} className="rounded-3xl bg-cyan-300/30">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{job?.title}</CardTitle>
                    <CardDescription>{job?.frequency}</CardDescription>
                  </div>
                  <div className="h-12 border rounded-full w-12">
                    <BookmarkButton jobId={job?.id} isBookmarked />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row justify-between text-sm">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{job?.location?.city}</span>
                  </div>
                  <div className="font-bold h-fit text-gray-700">
                    <Briefcase />
                    {formatSalary(job?.salaryRange?.min)} -{" "}
                    {formatSalary(job?.salaryRange?.max)} /{" "}
                    {job?.frequency || "N/A"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {user?.bookmarkedJobs?.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            No bookmarked jobs. Start saving jobs you&apos;re interested in!
          </p>
        )}
      </div>
    </Container>
  );
};

export default Bookmarks;
