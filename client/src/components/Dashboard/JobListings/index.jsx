import { Fragment, Suspense } from "react";
import JobCard from "../common/JobCard";
import CardSkeleton from "../common/JobCard/CardSkeleton";
import JobDetails from "./JobDetails";
import Loader from "../common/Loader";

import { Button } from "@/components/ui/button";

import { useAuth } from "@/hooks/useAuth";
import { useFilters } from "@/hooks/useFilters";
import { XCircle, PlusCircle, Search } from "lucide-react";

const UserJobListings = () => {
  const { jobQuery } = useFilters();
  const { user } = useAuth();
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = jobQuery;

  const isBookmarked = (jobId) => {
    return (
      user?.bookmarkedJobs?.some(
        (bookmarkedJob) => bookmarkedJob?.id === jobId
      ) || false
    );
  };

  return status === "pending" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 scroll-smooth py-2  scrollbar-none overflow-y-scroll mx-auto lg:grid-cols-3 xl:grid-cols-5 gap-3">
      {Array.from({ length: 10 }, (_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  ) : status === "error" ? (
    <div className="text-gray-500 text-3xl py-4 font-grotesk min-h-[calc(100vh-18vh)] flex flex-col items-center justify-center">
      <Search className="text-gray-500 w-16 h-16 mb-4" />
      {error?.response?.data?.message || "An unexpected error occurred."}
      <p>(Try clearing the filters)</p>
    </div>
  ) : (
    <Suspense fallback={<Loader />}>
      <div className="scroll-smooth py-2 scrollbar-thin lg:px-4 pb-24 lg:pb-0 lg:mb-0 overflow-auto mx-auto h-[calc(100vh-8vh)] rounded-md scrollbar-w-2 scrollbar-track-gray-200 scrollbar-thumb-primary">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-3">
          {data?.pages?.length > 0 ? (
            data?.pages?.map((page, i) => (
              <Fragment key={i}>
                {page?.jobs?.map((job) => (
                  <div key={job.id}>
                    <JobCard
                      isBookmarked={isBookmarked(job.id)}
                      key={job.id}
                      job={job}
                    >
                      <JobDetails
                        job={job}
                        isBookmarked={isBookmarked(job.id)}
                      />
                    </JobCard>
                  </div>
                ))}
              </Fragment>
            ))
          ) : (
            <div className="text-center absolute inset-x-0 inset-y-2/4 text-gray-500 font-grotesk text-xl">
              No Jobs Found....try clearing filters
            </div>
          )}
        </div>
        <div className="w-full py-6 flex items-center justify-center ">
          <Button
            variant="ghost"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="text-lg"
          >
            {isFetchingNextPage ? (
              <>
                <Loader size={20} className="mr-2" />
                Loading more...
              </>
            ) : hasNextPage ? (
              <>
                <PlusCircle size={20} className="mr-2" />
                Load More!!
              </>
            ) : (
              <>
                <XCircle size={20} className="mr-2" />
                Nothing more to load
              </>
            )}
          </Button>
        </div>
        <div>{isFetching && !isFetchingNextPage ? "Fetching..." : null}</div>
      </div>
    </Suspense>
  );
};

export default UserJobListings;
