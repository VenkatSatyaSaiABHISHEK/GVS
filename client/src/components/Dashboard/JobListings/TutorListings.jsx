import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getTutors, sendTuitionRequest } from "@/services/tuitionServices";
import { Search, MapPin, Star, Briefcase, IndianRupee, Filter, Send, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const TutorListings = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedTutor, setSelectedTutor] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");

    const { data, isLoading } = useQuery({
        queryKey: ["tutors", searchTerm, selectedCity],
        queryFn: () => getTutors({ subject: searchTerm, city: selectedCity }),
        keepPreviousData: true,
    });

    const mutation = useMutation({
        mutationFn: sendTuitionRequest,
        onSuccess: () => {
            toast.success("Request sent successfully!");
            setSelectedTutor(null);
            setRequestMessage("");
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to send request");
        },
    });

    const handleRequestSubmit = () => {
        if (!selectedTutor) return;
        mutation.mutate({
            teacherId: selectedTutor.id,
            subject: searchTerm || "General",
            message: requestMessage,
            preferredMode: "both" // Can be refined to use parent preferences
        });
    };

    return (
        <div className="space-y-6 lg:p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="Search by subject (e.g. Mathematics, Science)"
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative md:w-64">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder="City"
                        className="pl-10"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                    />
                </div>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" /> Filter
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {data?.tutors?.map((tutor) => (
                        <Card key={tutor.id} className="overflow-hidden hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <Avatar className="h-20 w-20 border-2 border-primary/10">
                                    <AvatarImage src={tutor.profilePic} />
                                    <AvatarFallback className="text-2xl">{tutor.fullName?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl truncate">{tutor.fullName}</CardTitle>
                                        {tutor.isVerified && (
                                            <CheckCircle2 size={16} className="text-blue-500 fill-blue-500/10" title="Verified" />
                                        )}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                                        <Star size={14} className="fill-yellow-500 text-yellow-500 mr-1" />
                                        <span className="font-semibold text-black">{tutor.ratingAvg || 0}</span>
                                        <span className="mx-1">•</span>
                                        <span>{tutor.totalReviews || 0} reviews</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-1.5">
                                    {tutor.subjects?.map((subject) => (
                                        <Badge key={subject} variant="outline" className="text-[11px] uppercase tracking-wider">
                                            {subject}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Briefcase size={14} className="text-primary" />
                                        <span>{tutor.experienceYears || 0} Years Experience</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <IndianRupee size={14} className="text-primary" />
                                        <span className="font-semibold text-black">₹{tutor.tuitionFee || 0}</span>
                                        <span className="text-xs">/ Hourly</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="truncate">{tutor.address || "Anywhere"}</span>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 pt-4 flex gap-2">
                                <Dialog open={selectedTutor?.id === tutor.id} onOpenChange={(open) => !open && setSelectedTutor(null)}>
                                    <DialogTrigger asChild>
                                        <Button className="flex-1 gap-2" size="sm" onClick={() => setSelectedTutor(tutor)}>
                                            <Send size={14} /> Send Request
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Send Tuition Request to {tutor.fullName}</DialogTitle>
                                            <DialogDescription>
                                                Explain your child&apos;s needs and required subjects.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4">
                                            <Textarea
                                                placeholder="e.g. Need help with Class 10th Math and Physics. Available on weekends."
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                                className="min-h-[120px]"
                                            />
                                            <Button className="w-full" onClick={handleRequestSubmit} disabled={mutation.isLoading}>
                                                {mutation.isLoading ? "Sending..." : "Confirm Request"}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="outline" size="sm">View Profile</Button>
                            </CardFooter>
                        </Card>
                    ))}
                    {data?.tutors?.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-muted-foreground text-xl">No tutors found for your search.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TutorListings;
