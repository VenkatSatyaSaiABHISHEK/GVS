import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Edit2, MapPin, Globe, Mail, Phone, Building2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import InstitutionForm from "./InstitutionForm";
import { createInstitution, updateInstitution } from "@/services/institutionServices";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const InstitutionProfile = () => {
    const { user, isLoading: authLoading } = useAuth();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingInstitution, setEditingInstitution] = useState(null);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (editingInstitution) {
                return updateInstitution(editingInstitution.id, data);
            } else {
                return createInstitution(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["currentUser"]);
            toast.success(editingInstitution ? "Institution updated!" : "Institution created!");
            setIsDialogOpen(false);
            setEditingInstitution(null);
        },
        onError: (error) => {
            toast.error("Error: " + (error?.response?.data?.message || "Something went wrong"));
        },
    });

    const handleEdit = (institution) => {
        setEditingInstitution(institution);
        setIsDialogOpen(true);
    };

    if (authLoading) return <div>Loading...</div>;

    const institutions = user?.companies || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold">Manage Institutions</h2>
                    <p className="text-muted-foreground">Manage your schools, colleges, and coaching centers.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingInstitution(null);
                }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2">
                            <Plus size={18} /> Add Institution
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingInstitution ? "Edit Institution" : "Add New Institution"}</DialogTitle>
                        </DialogHeader>
                        <InstitutionForm
                            initialData={editingInstitution}
                            onSubmit={(data) => mutation.mutate(data)}
                            isLoading={mutation.isLoading}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {institutions.length === 0 ? (
                    <Card className="col-span-full py-12 text-center border-dashed">
                        <CardContent>
                            <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                            <p className="text-xl font-medium">No institutions added yet</p>
                            <p className="text-muted-foreground mb-6">Add your first institution to start posting jobs.</p>
                            <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> Add First Institution
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    institutions.map((institution) => (
                        <Card key={institution.id} className="relative overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                                <Avatar className="h-16 w-16 border-2 border-primary/10">
                                    <AvatarImage src={institution.logo} />
                                    <AvatarFallback className="text-xl">{institution.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-xl">{institution.name}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleEdit(institution)}
                                            className="text-muted-foreground hover:text-primary"
                                        >
                                            <Edit2 size={18} />
                                        </Button>
                                    </div>
                                    <CardDescription className="flex items-center gap-1 font-medium text-primary">
                                        <Building2 size={14} />
                                        {institution.type || "School"}
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {institution.description && (
                                    <p className="text-sm line-clamp-2 text-muted-foreground italic">
                                        &quot;{institution.description}&quot;
                                    </p>
                                )}

                                <div className="grid grid-cols-1 gap-2 text-sm border-t pt-4">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin size={14} className="flex-shrink-0 text-primary" />
                                        <span>{institution.location?.address ? `${institution.location.address}, ` : ""}{institution.location?.city}, {institution.location?.country}</span>
                                    </div>

                                    <div className="flex items-center gap-4 mt-1">
                                        {institution.contactEmail && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Mail size={14} className="text-primary" />
                                                <span className="truncate max-w-[150px]">{institution.contactEmail}</span>
                                            </div>
                                        )}
                                        {institution.contactPhone && (
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <Phone size={14} className="text-primary" />
                                                <span>{institution.contactPhone}</span>
                                            </div>
                                        )}
                                    </div>

                                    {institution.website && (
                                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                            <Globe size={14} className="text-primary" />
                                            <a href={institution.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate">
                                                {institution.website.replace(/(^\w+:|^)\/\//, '')}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default InstitutionProfile;
