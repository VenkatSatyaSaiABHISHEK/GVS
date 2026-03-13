import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTeacherTuitionDashboardData, updateTuitionRequestStatus } from "@/services/tuitionServices";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, MessageCircle, BookOpen, UserCheck, CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";

const TeacherTuitions = () => {
    const queryClient = useQueryClient();
    const { data: dashboard, isLoading } = useQuery({
        queryKey: ["teacher-tuition-dashboard"],
        queryFn: getTeacherTuitionDashboardData,
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, data }) => updateTuitionRequestStatus(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["teacher-tuition-dashboard"]);
            toast.success("Request status updated!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update request");
        }
    });

    if (isLoading) return <div>Loading tuition requests...</div>;

    const data = dashboard?.data || { activeStudentsCount: 0, pendingRequestsCount: 0, requests: [] };

    const handleStatusUpdate = (id, newStatus, schedule = null) => {
        const payload = { status: newStatus };
        if (schedule) payload.demoSchedule = schedule;
        statusMutation.mutate({ id, data: payload });
    };

    const statusColors = {
        pending: "bg-yellow-100 text-yellow-800",
        accepted: "bg-green-100 text-green-800",
        rejected: "bg-red-100 text-red-800",
        completed: "bg-blue-100 text-blue-800",
        scheduled: "bg-purple-100 text-purple-800",
    };

    return (
        <div className="space-y-8 lg:p-6">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tuition Requests</h2>
                    <p className="text-muted-foreground mt-1">Manage parent requests and schedule demo classes.</p>
                </div>
                <div className="flex gap-4">
                    <Card className="flex flex-col items-center justify-center px-6 py-4 border-2 border-primary/10">
                        <span className="text-2xl font-bold text-primary">{data.activeStudentsCount}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1 flex items-center gap-1">
                            <UserCheck size={12} /> Active Students
                        </span>
                    </Card>
                    <Card className="flex flex-col items-center justify-center px-6 py-4 border-2 border-primary/10">
                        <span className="text-2xl font-bold text-yellow-600">{data.pendingRequestsCount}</span>
                        <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mt-1 flex items-center gap-1">
                            <MessageCircle size={12} /> Pending Requests
                        </span>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {data.requests.length === 0 ? (
                    <Card className="py-20 text-center border-dashed">
                        <p className="text-muted-foreground">You don&apos;t have any tuition requests yet.</p>
                        <p className="text-sm text-muted-foreground mt-2">Make sure your profile is complete to attract more students!</p>
                    </Card>
                ) : (
                    data.requests.map((request) => (
                        <Card key={request.id} className="relative overflow-hidden border-2 hover:border-primary/20 transition-all">
                            <CardContent className="p-0">
                                <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
                                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                                        <AvatarImage src={request.parent?.profilePic} />
                                        <AvatarFallback className="text-xl">{request.parent?.fullName?.charAt(0)}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 space-y-3 w-full">
                                        <div className="flex flex-wrap items-center justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-lg">{request.parent?.fullName} <span className="text-sm font-normal text-muted-foreground">(Parent)</span></h4>
                                                <div className="flex flex-wrap items-center text-xs text-muted-foreground mt-1 gap-4 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen size={14} className="text-primary" /> Class {request.childClass} ({request.subject})
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin size={14} className="text-primary" /> {request.parent?.address || 'Location not provided'}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge className={`${statusColors[request.status] || "bg-gray-100"} px-3 py-1 capitalize select-none text-sm`}>
                                                {request.status}
                                            </Badge>
                                        </div>

                                        <div className="bg-muted/50 p-4 rounded-xl border-l-4 border-primary/40 italic">
                                            &quot;{request.message || "No specific message provided by parent."}&quot;
                                        </div>

                                        {/* Actions based on status */}
                                        <div className="flex flex-wrap gap-3 pt-2 items-center">
                                            {request.status === "pending" && (
                                                <>
                                                    <Button variant="default" className="gap-2" onClick={() => handleStatusUpdate(request.id, 'accepted')}>
                                                        <CheckCircle2 size={16} /> Accept
                                                    </Button>
                                                    <Button variant="outline" className="gap-2 text-red-600 hover:text-red-700" onClick={() => handleStatusUpdate(request.id, 'rejected')}>
                                                        <XCircle size={16} /> Decline
                                                    </Button>
                                                </>
                                            )}

                                            {request.status === "accepted" && !request.demoSchedule && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className="gap-2">
                                                            <CalendarDays size={16} /> Schedule Demo
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            onSelect={(date) => {
                                                                if (date) handleStatusUpdate(request.id, 'scheduled', date);
                                                            }}
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            )}

                                            {request.demoSchedule && (
                                                <Badge variant="outline" className="text-sm py-1.5 px-3 bg-primary/5 text-primary border-primary/20 flex gap-2 items-center">
                                                    <CalendarDays size={14} /> Demo Scheduled: {format(new Date(request.demoSchedule), "PPP")}
                                                </Badge>
                                            )}

                                            {request.parent?.contactEmail && (
                                                <Button variant="secondary" className="gap-2" onClick={() => window.location.href = `mailto:${request.parent.contactEmail}`}>
                                                    <MessageCircle size={16} /> Contact Parent
                                                </Button>
                                            )}

                                            {['accepted', 'scheduled', 'paid', 'completed'].includes(request.status) && (
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="ghost" className="gap-2 text-primary">
                                                            + Add Note
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 p-4 space-y-4">
                                                        <div className="space-y-2">
                                                            <h4 className="font-medium leading-none">Student Progress Notes</h4>
                                                            <p className="text-sm text-muted-foreground">Keep track of the student&apos;s learning journey.</p>
                                                        </div>
                                                        <div className="space-y-2 max-h-[150px] overflow-y-auto">
                                                            {request.notes?.map((n, i) => (
                                                                <div key={i} className="text-sm bg-muted p-2 rounded-md">{n}</div>
                                                            ))}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                id={`note-${request.id}`}
                                                                placeholder="Type a new note..."
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                                                        statusMutation.mutate({
                                                                            id: request.id,
                                                                            data: { newNote: e.currentTarget.value }
                                                                        });
                                                                        e.currentTarget.value = "";
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default TeacherTuitions;
