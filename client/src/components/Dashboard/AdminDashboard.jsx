import { ShieldCheck, Users, Briefcase, Building2, IndianRupee, HandCoins, CheckCircle, Ban } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminStats, getAllUsers, verifyUser, blockUser, getAllPayments } from "@/services/adminServices";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminDashboard = () => {
    const queryClient = useQueryClient();

    const { data: statsData, isLoading: loadingStats } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: getAdminStats,
    });

    const { data: usersData, isLoading: loadingUsers } = useQuery({
        queryKey: ["admin-users"],
        queryFn: () => getAllUsers(),
    });

    const { data: paymentsData, isLoading: loadingPayments } = useQuery({
        queryKey: ["admin-payments"],
        queryFn: getAllPayments,
    });

    const verifyMutation = useMutation({
        mutationFn: ({ id, isVerified }) => verifyUser(id, isVerified),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-users"]);
            toast.success("User verification status updated!");
        }
    });

    const blockMutation = useMutation({
        mutationFn: ({ id, isBlocked }) => blockUser(id, isBlocked),
        onSuccess: () => {
            queryClient.invalidateQueries(["admin-users"]);
            toast.success("User block status updated!");
        }
    });

    if (loadingStats || loadingUsers || loadingPayments) {
        return <div className="p-8 text-center text-muted-foreground">Loading Admin Console...</div>;
    }

    const { totalUsersCount, activeTeachersCount, activeSchoolsCount, tuitionBookings, monthlyRevenue } = statsData?.stats || {};
    const users = usersData?.users || [];
    const payments = paymentsData?.payments || [];

    const statsConfig = [
        { title: "Total Users", value: totalUsersCount || 0, icon: <Users size={24} />, color: "bg-blue-500" },
        { title: "Active Teachers", value: activeTeachersCount || 0, icon: <Briefcase size={24} />, color: "bg-green-500" },
        { title: "Active Schools", value: activeSchoolsCount || 0, icon: <Building2 size={24} />, color: "bg-purple-500" },
        { title: "Tuition Bookings", value: tuitionBookings || 0, icon: <HandCoins size={24} />, color: "bg-orange-500" },
        { title: "Total Revenue (₹)", value: `₹${monthlyRevenue || "0"}`, icon: <IndianRupee size={24} />, color: "bg-emerald-600" },
    ];

    return (
        <div className="p-4 lg:p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold font-grotesk tracking-tight">Gravity Admin Console</h1>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                    <ShieldCheck size={16} />
                    Super Admin Access
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
                {statsConfig.map((stat, index) => (
                    <div key={index} className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`p-2 rounded-lg text-white ${stat.color}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="users">User Management</TabsTrigger>
                    <TabsTrigger value="payments">Payment & Subscriptions</TabsTrigger>
                </TabsList>

                <TabsContent value="users">
                    <Card>
                        <CardContent className="p-0 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User details</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Joined</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.length === 0 ? (
                                        <TableRow><TableCell colSpan={5} className="text-center py-4">No users found.</TableCell></TableRow>
                                    ) : users.map(u => (
                                        <TableRow key={u.id}>
                                            <TableCell>
                                                <div className="font-medium">{u.fullName || "N/A"}</div>
                                                <div className="text-sm text-muted-foreground">{u.email}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="capitalize">{{ jobSeeker: 'Teacher', recruiter: 'School', parent: 'Parent', admin: 'Admin' }[u.role] || u.role}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(u.createdAt), "dd MMM yyyy")}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 items-start">
                                                    {u.isVerified ? (
                                                        <Badge variant="secondary" className="bg-green-100 text-green-800">Verified</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
                                                    )}
                                                    {u.isBlocked && <Badge variant="destructive">Blocked</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                {!u.isVerified ? (
                                                    <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 font-semibold" onClick={() => verifyMutation.mutate({ id: u.id, isVerified: true })}>
                                                        <CheckCircle className="mr-1" size={14} /> Approve
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="secondary" onClick={() => verifyMutation.mutate({ id: u.id, isVerified: false })}>
                                                        Revoke
                                                    </Button>
                                                )}

                                                {u.isBlocked ? (
                                                    <Button size="sm" variant="outline" onClick={() => blockMutation.mutate({ id: u.id, isBlocked: false })}>
                                                        Unblock
                                                    </Button>
                                                ) : (
                                                    <Button size="sm" variant="destructive" onClick={() => blockMutation.mutate({ id: u.id, isBlocked: true })}>
                                                        <Ban className="mr-1" size={14} /> Block
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments">
                    <Card>
                        <CardContent className="p-0 overflow-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Payment ID</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Type / Plan</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.length === 0 ? (
                                        <TableRow><TableCell colSpan={6} className="text-center py-4">No payment history found.</TableCell></TableRow>
                                    ) : payments.map(p => (
                                        <TableRow key={p.id}>
                                            <TableCell className="font-mono text-xs text-muted-foreground">{p.razorpayOrderId}</TableCell>
                                            <TableCell>
                                                <div className="font-medium">{p.user?.fullName}</div>
                                                <div className="text-sm text-muted-foreground capitalize">{p.user?.role}</div>
                                            </TableCell>
                                            <TableCell className="font-bold whitespace-nowrap">₹ {p.amount}</TableCell>
                                            <TableCell>
                                                <div className="capitalize">{p.paymentType.replace('_', ' ')}</div>
                                                <div className="text-xs text-muted-foreground uppercase">{p.planId}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={p.status === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800'}>
                                                    {p.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{format(new Date(p.createdAt), "dd MMM, yyyy HH:mm")}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminDashboard;
