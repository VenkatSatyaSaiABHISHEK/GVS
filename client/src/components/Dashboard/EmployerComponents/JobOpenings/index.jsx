import ApplicantsDrawer from "../common/ApplicationDrawer";
import { Button } from "@/components/ui/button";
import CardSkeleton from "../../common/JobCard/CardSkeleton";
import JobCard from "../../common/JobCard";
import { getSchoolJobs, updateJob } from "@/services/JobServices";
import { useAuth } from "@/hooks/useAuth";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useState, useCallback } from "react";
import { Users, PencilIcon, Loader, PlusCircle, XCircle } from "lucide-react";
import JobForm from "../JobForm";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Fragment } from "react";

const JobOpenings = () => {
  const form = useForm({
    defaultValues: {
      company: "",
      title: "",
      description: "",
      location: {
        city: "",
        state: "",
        country: "",
      },
      salaryRange: {
        min: "",
        max: "",
      },
      subject: "",
      qualificationRequired: "",
      tags: [],
      socials: {
        linkedin: "",
        twitter: "",
        website: "",
      },
      frequency: "yearly",
      skillsRequired: "",
      status: "open",
      jobType: "full time",
      workFrom: "on-site",
      experience: "entry-level",
    },
    values: {
      company: "",
      title: "",
      description: "",
      location: {
        city: "",
        state: "",
        country: "",
      },
      salaryRange: {
        min: "",
        max: "",
      },
      subject: "",
      qualificationRequired: "",
      tags: [],
      socials: {
        linkedin: "",
        twitter: "",
        website: "",
      },
      frequency: "yearly",
      skillsRequired: "",
      status: "open",
      jobType: "full time",
      workFrom: "on-site",
      experience: "entry-level",
    },
  });
  const [openStates, setOpenStates] = useState({});
  const [editingJob, setEditingJob] = useState(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filters] = useState({});

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    error,
    status,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["school-job-listing"],
    queryFn: ({ pageParam = null }) =>
      getSchoolJobs({ ...filters, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    keepPreviousData: true,
    staleTime: 5000,
    enabled: !editingJob,
  });

  const { mutate: editJob } = useMutation({
    mutationKey: ["update-job"],
    mutationFn: ({ id, jobData }) => updateJob(id, jobData),
    onSuccess: ({ message }) => {
      toast.success("Success!", {
        description: message,
      });
      queryClient.invalidateQueries("school-job-listing");
      setEditingJob(null);
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed Updating A Job Posting",
      });
    },
  });

  const onSubmit = useCallback(
    (jobData) => {
      editJob({ id: editingJob.id, jobData });
    },
    [editingJob?.id, editJob]
  );

  const onCancel = useCallback(() => {
    setEditingJob(null);
  }, []);

  const handleDialogChange = useCallback(
    (open) => {
      if (!open) {
        setEditingJob(null);
        form.reset({}); // Clear form
      }
    },
    [form]
  );

  const isBookmarked = (jobId) => {
    return (
      user?.bookmarkedJobs?.some(
        (bookmarkedJob) => bookmarkedJob?.id === jobId
      ) || false
    );
  };

  const handleSetOpen = (jobId, isOpen) => {
    setOpenStates((prev) => ({ ...prev, [jobId]: isOpen }));
  };

  const handleEditClick = (job) => {
    /* setLoading(true); */ // Add loading state
    setEditingJob(job);
    form.reset(job, {
      keepErrors: false,
      keepDirty: false,
    });
    /* setLoading(false); */
  };

  if (status === "pending") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 scroll-smooth py-2 scrollbar-none overflow-y-scroll mx-auto lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }, (_, index) => (
          <CardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return <div className="text-red-500 text-5xl">{error?.message}</div>;
  }

  return (
    <>
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
                      <div className="grid w-fit grid-cols-2 gap-1">
                        <Button
                          title="View Applicants"
                          size="icon"
                          className="hover:invert border-primary font-semibold rounded-full"
                          variant={
                            job?.applicants?.length === 0
                              ? "destructive"
                              : "outline"
                          }
                          onClick={() => handleSetOpen(job.id, true)}
                          disabled={job?.applicants?.length === 0}
                        >
                          <Users size={20} />
                        </Button>

                        <Button
                          title="Edit Job Details"
                          onClick={() => handleEditClick(job)}
                          size="icon"
                          className="hover:invert border-primary font-semibold rounded-full"
                        >
                          <PencilIcon size={20} />
                        </Button>
                      </div>
                    </JobCard>
                    <ApplicantsDrawer
                      open={openStates[job?.id] || false}
                      setOpen={(isOpen) => handleSetOpen(job?.id, isOpen)}
                      job={job}
                      isBookmarked={isBookmarked(job.id)}
                    />
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

      <Dialog open={!!editingJob} onOpenChange={handleDialogChange}>
        <DialogContent
          className="max-h-screen py-6 overflow-auto w-screen min-w-full"
          aria-describedby="dialog-description"
        >
          <DialogTitle>JOB FORM</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            Form to edit job details
          </DialogDescription>
          {editingJob && (
            <JobForm
              companies={user?.companies}
              form={form}
              onSubmit={onSubmit}
              onCancel={onCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JobOpenings;
