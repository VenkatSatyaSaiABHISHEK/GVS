import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDemoClasses, updateDemoClassStatus, proposeDemoClass } from "@/services/tuitionServices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Calendar, Clock, MapPin, Video, DollarSign, Check, X, Plus,
    MessageSquare, UserCheck
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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { format } from "date-fns";

const DemoClassesPanel = () => {
    const queryClient = useQueryClient();
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        parentId: "",
        subject: "",
        topic: "",
        proposedDate: "",
        proposedTime: "",
        durationMinutes: 30,
        mode: "online",
        meetingLink: "",
        location: "",
        demoType: "free",
        demoFee: 0
    });

    const { data: demoData, isLoading } = useQuery({
        queryKey: ["demo-classes"],
        queryFn: getDemoClasses
    });

    const updateMutation = useMutation({
        mutationFn: ({ demoClassId, data }) => updateDemoClassStatus(demoClassId, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["demo-classes"]);
            toast.success("Demo class updated!");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to update");
        }
    });

    const proposeMutation = useMutation({
        mutationFn: proposeDemoClass,
        onSuccess: () => {
            queryClient.invalidateQueries(["demo-classes"]);
            toast.success("Demo class proposed!");
            setOpenDialog(false);
            setFormData({
                parentId: "",
                subject: "",
                topic: "",
                proposedDate: "",
                proposedTime: "",
                durationMinutes: 30,
                mode: "online",
                meetingLink: "",
                location: "",
                demoType: "free",
                demoFee: 0
            });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to propose");
        }
    });

    const handleStatusChange = (demoClassId, newStatus) => {
        updateMutation.mutate({ demoClassId, data: { status: newStatus } });
    };

    if (isLoading) return <div className="p-6 text-center">Loading...</div>;

    const demoClasses = demoData?.demoClasses || [];
    const aggregatedByStatus = {
        proposed: demoClasses.filter(d => d.status === "proposed").length,
        scheduled: demoClasses.filter(d => d.status === "scheduled").length,
        completed: demoClasses.filter(d => d.status === "completed").length,
        cancelled: demoClasses.filter(d => d.status === "cancelled").length
    };

    const statusColors = {
        proposed: "bg-blue-100 text-blue-800",
        scheduled: "bg-green-100 text-green-800",
        completed: "bg-purple-100 text-purple-800",
        cancelled: "bg-red-100 text-red-800",
        no_show: "bg-red-100 text-red-800"
    };

    return (
        <div className="space-y-6 lg:p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Demo Classes</h2>
                    <p className="text-muted-foreground mt-1">Schedule and manage demo sessions with parents</p>
                </div>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={16} />
                            Propose Demo
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Propose a Demo Class</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Subject *</Label>
                                <Input
                                    placeholder="e.g., Math, Physics"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Topic (Optional)</Label>
                                <Input
                                    placeholder="e.g., Algebra Basics"
                                    value={formData.topic}
                                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Date *</Label>
                                    <Input
                                        type="date"
                                        value={formData.proposedDate}
                                        onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label>Time *</Label>
                                    <Input
                                        type="time"
                                        value={formData.proposedTime}
                                        onChange={(e) => setFormData({ ...formData, proposedTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Mode *</Label>
                                <Select value={formData.mode} onValueChange={(value) => setFormData({ ...formData, mode: value })}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="offline">Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {formData.mode === "online" && (
                                <div>
                                    <Label>Meeting Link</Label>
                                    <Input
                                        placeholder="https://zoom.us/your-link"
                                        value={formData.meetingLink}
                                        onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                                    />
                                </div>
                            )}
                            {formData.mode === "offline" && (
                                <div>
                                    <Label>Location</Label>
                                    <Input
                                        placeholder="Meeting location address"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label>Type *</Label>
                                    <Select value={formData.demoType} onValueChange={(value) => setFormData({ ...formData, demoType: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="free">Free</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {formData.demoType === "paid" && (
                                    <div>
                                        <Label>Fee (₹)</Label>
                                        <Input
                                            type="number"
                                            value={formData.demoFee}
                                            onChange={(e) => setFormData({ ...formData, demoFee: parseInt(e.target.value) })}
                                        />
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => proposeMutation.mutate(formData)}
                                disabled={proposeMutation.isPending || !formData.subject || !formData.proposedDate || !formData.proposedTime}
                                className="w-full"
                            >
                                {proposeMutation.isPending ? "Proposing..." : "Propose Demo"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(aggregatedByStatus).map(([status, count]) => (
                    <Card key={status}>
                        <CardContent className="p-4">
                            <p className="text-xs text-muted-foreground uppercase font-semibold">
                                {status}
                            </p>
                            <p className="text-2xl font-bold mt-2">{count}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Demo Classes List */}
            {demoClasses.length === 0 ? (
                <Card className="py-20 text-center border-dashed">
                    <CardContent>
                        <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                        <p className="text-muted-foreground">No demo classes yet</p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Propose demo sessions to attract students
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {demoClasses.map((demo) => (
                        <Card key={demo.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Info */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg">{demo.subject}</h4>
                                                {demo.topic && (
                                                    <p className="text-sm text-muted-foreground">Topic: {demo.topic}</p>
                                                )}
                                            </div>
                                            <Badge className={statusColors[demo.status]}>
                                                {demo.status}
                                            </Badge>
                                        </div>

                                        {/* Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-3 border-y">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={16} className="text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Date</p>
                                                    <p className="text-sm font-medium">
                                                        {format(new Date(demo.proposedDate), "MMM dd")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={16} className="text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Time</p>
                                                    <p className="text-sm font-medium">{demo.proposedTime}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {demo.mode === "online" ? (
                                                    <Video size={16} className="text-muted-foreground" />
                                                ) : (
                                                    <MapPin size={16} className="text-muted-foreground" />
                                                )}
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Mode</p>
                                                    <p className="text-sm font-medium capitalize">{demo.mode}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <DollarSign size={16} className="text-muted-foreground" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Type</p>
                                                    <p className="text-sm font-medium capitalize">
                                                        {demo.demoType === "paid" ? `₹${demo.demoFee}` : "Free"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Location/Link */}
                                        {demo.mode === "online" && demo.meetingLink && (
                                            <a
                                                href={demo.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                            >
                                                <Video size={14} />
                                                Join Meeting
                                            </a>
                                        )}
                                        {demo.mode === "offline" && demo.location && (
                                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                <MapPin size={14} />
                                                {demo.location}
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex flex-col gap-2 w-full md:w-auto">
                                        {demo.status === "proposed" && (
                                            <>
                                                <Button
                                                    onClick={() => handleStatusChange(demo.id, "scheduled")}
                                                    disabled={updateMutation.isPending}
                                                    className="gap-2"
                                                    size="sm"
                                                >
                                                    <Check size={16} />
                                                    Confirm
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleStatusChange(demo.id, "cancelled")}
                                                    disabled={updateMutation.isPending}
                                                    className="gap-2 text-red-600"
                                                    size="sm"
                                                >
                                                    <X size={16} />
                                                    Cancel
                                                </Button>
                                            </>
                                        )}
                                        {demo.status === "scheduled" && (
                                            <>
                                                <Button
                                                    onClick={() => handleStatusChange(demo.id, "completed")}
                                                    disabled={updateMutation.isPending}
                                                    className="gap-2"
                                                    size="sm"
                                                >
                                                    <Check size={16} />
                                                    Mark Complete
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="gap-2"
                                                    size="sm"
                                                >
                                                    <MessageSquare size={16} />
                                                    Message Parent
                                                </Button>
                                            </>
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

export default DemoClassesPanel;
