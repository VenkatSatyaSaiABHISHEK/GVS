import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getActiveStudents, updateActiveStudentStatus } from "@/services/tuitionServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
    Calendar, DollarSign, BookOpen, Clock, Edit2, Trash2, Check, X,
    MapPin, Users
} from "lucide-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";

const ActiveStudentsPanel = () => {
    const queryClient = useQueryClient();
    const [editingStudent, setEditingStudent] = useState(null);
    const [notes, setNotes] = useState("");

    const { data: studentsData, isLoading } = useQuery({
        queryKey: ["active-students"],
        queryFn: getActiveStudents
    });

    const updateMutation = useMutation({
        mutationFn: ({ studentId, data }) => updateActiveStudentStatus(studentId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["active-students"]);
            toast.success("Student status updated!");
            setEditingStudent(null);
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    });

    const handleStatusChange = (studentId, newStatus) => {
        updateMutation.mutate({
            studentId,
            data: { status: newStatus }
        });
    };

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;

    const students = studentsData?.activeStudents || [];
    const totalMonthlyEarnings = studentsData?.totalMonthlyEarnings || 0;

    const statusStyles = {
        active: "bg-green-100 text-green-800",
        paused: "bg-yellow-100 text-yellow-800",
        completed: "bg-blue-100 text-blue-800",
        cancelled: "bg-red-100 text-red-800"
    };

    return (
        <div className="space-y-6 lg:p-6">
            {/* Header & Stats */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Active Students</h2>
                <p className="text-muted-foreground mt-1">Manage your ongoing students and schedules</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Total Students</p>
                                <p className="text-2xl font-bold mt-2">{students.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-primary/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Monthly Income</p>
                                <p className="text-2xl font-bold mt-2">₹{totalMonthlyEarnings}</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-400/20" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase font-semibold">Classes This Month</p>
                                <p className="text-2xl font-bold mt-2">{students.reduce((sum, s) => sum + (s.classesCompleted || 0), 0)}</p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-400/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Students List */}
            {students.length === 0 ? (
                <Card className="py-20 text-center border-dashed">
                    <CardContent>
                        <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No active students yet</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Accept tuition requests to add students
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {students.map((student) => (
                        <Card key={student.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    {/* Student Avatar */}
                                    <Avatar className="h-16 w-16 border-2 border-primary/10">
                                        <AvatarImage src={student.parent?.profilePic} />
                                        <AvatarFallback className="text-xl">
                                            {student.parent?.fullName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    {/* Student Info */}
                                    <div className="flex-1 w-full space-y-3">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-lg">{student.studentName}</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {student.parent?.fullName} (Parent)
                                                </p>
                                            </div>
                                            <Badge className={statusStyles[student.status]}>
                                                {student.status}
                                            </Badge>
                                        </div>

                                        {/* Student Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y">
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase">Class</p>
                                                <p className="text-sm font-medium">{student.studentClass}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase">Subject</p>
                                                <p className="text-sm font-medium">{student.subject}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase">Fee/Month</p>
                                                <p className="text-sm font-medium">₹{student.monthlyFee}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-semibold uppercase">Mode</p>
                                                <p className="text-sm font-medium capitalize">{student.mode}</p>
                                            </div>
                                        </div>

                                        {/* Schedule & Earnings */}
                                        <div className="space-y-2">
                                            {student.schedule?.length > 0 && (
                                                <div className="flex items-start gap-2">
                                                    <Calendar size={16} className="text-primary mt-0.5" />
                                                    <div>
                                                        <p className="text-xs text-muted-foreground font-semibold uppercase">Schedule</p>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {student.schedule.map((sched, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                                    {sched.day} - {sched.time} ({sched.duration}min)
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex items-start gap-2">
                                                <DollarSign size={16} className="text-green-600 mt-0.5" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-semibold uppercase">Total Earnings</p>
                                                    <p className="font-semibold">₹{student.totalEarnings || 0}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Next Class & Contact */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            {student.nextClassDate && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-semibold">Next Class</p>
                                                    <p className="font-medium">
                                                        {format(new Date(student.nextClassDate), "MMM dd, yyyy")}
                                                    </p>
                                                </div>
                                            )}
                                            {student.startDate && (
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-semibold">Started</p>
                                                    <p className="font-medium">
                                                        {format(new Date(student.startDate), "MMM dd, yyyy")}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-2"
                                                    onClick={() => setNotes(student.teacherNotes || "")}
                                                >
                                                    <Edit2 size={16} />
                                                    Notes
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Update Student Notes</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4">
                                                    <Textarea
                                                        placeholder="Add notes about this student..."
                                                        value={notes}
                                                        onChange={(e) => setNotes(e.target.value)}
                                                        className="min-h-24"
                                                    />
                                                    <Button
                                                        onClick={() => {
                                                            updateMutation.mutate({
                                                                studentId: student.id,
                                                                data: { teacherNotes: notes }
                                                            });
                                                        }}
                                                        disabled={updateMutation.isPending}
                                                    >
                                                        Save Notes
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        {student.status === "active" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-yellow-600"
                                                onClick={() => handleStatusChange(student.id, "paused")}
                                                disabled={updateMutation.isPending}
                                            >
                                                <Clock size={16} />
                                                Pause
                                            </Button>
                                        )}

                                        {student.status === "active" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-red-600"
                                                onClick={() => handleStatusChange(student.id, "cancelled")}
                                                disabled={updateMutation.isPending}
                                            >
                                                <X size={16} />
                                                End
                                            </Button>
                                        )}

                                        {student.status !== "active" && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="gap-2 text-green-600"
                                                onClick={() => handleStatusChange(student.id, "active")}
                                                disabled={updateMutation.isPending}
                                            >
                                                <Check size={16} />
                                                Activate
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ActiveStudentsPanel;
