import { useState } from "react";
import { X, Star, MapPin, Briefcase, IndianRupee, Wifi, BookOpen, Award, Lock, Unlock, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { sendTuitionRequest } from "@/services/tuitionServices";
import { toast } from "sonner";
import axiosInstance from "@/lib/axiosInstance";

const loadRazorpay = () =>
    new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

const UNLOCK_PLANS = [
    { id: "chat", label: "Chat Unlock", price: 199, description: "Send unlimited messages to this teacher", icon: "💬" },
    { id: "contact", label: "Contact + Chat", price: 299, description: "Get phone number, WhatsApp & full chat", icon: "📞" },
    { id: "demo", label: "Full Access", price: 499, description: "Contact + Chat + Book Demo Class", icon: "🎯" },
];

const TeacherProfileModal = ({ teacher, onClose, user }) => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [message, setMessage] = useState("");

    const requestMutation = useMutation({
        mutationFn: sendTuitionRequest,
        onSuccess: () => {
            toast.success("Tuition request sent!");
            setMessage("");
        },
        onError: (err) => toast.error(err.response?.data?.message || "Failed to send request"),
    });

    const handleUnlockPayment = async (plan) => {
        const ok = await loadRazorpay();
        if (!ok) { toast.error("Razorpay SDK failed to load"); return; }

        try {
            const { data } = await axiosInstance.post("/payment/create-order", {
                amount: plan.price,
                paymentType: "teacher_unlock",
                planId: plan.id,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
                amount: data.order.amount,
                currency: data.order.currency,
                name: "Gravity – Unlock Teacher",
                description: `${plan.label} for ${teacher.fullName}`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const verify = await axiosInstance.post("/payment/verify-payment", {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            paymentId: data.paymentId,
                        });
                        if (verify.data.success) {
                            setIsUnlocked(true);
                            setShowUnlockModal(false);
                            toast.success(`🎉 ${plan.label} unlocked for ${teacher.fullName}!`);
                        }
                    } catch (_) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: { name: user?.fullName || "", email: user?.email || "" },
                theme: { color: "#0f172a" },
            };
            new window.Razorpay(options).open();
        } catch (_) {
            toast.error("Could not initiate payment.");
        }
    };

    const handleSendRequest = () => {
        if (!message.trim()) { toast.error("Please enter a message"); return; }
        requestMutation.mutate({
            teacherId: teacher.id,
            subject: (teacher.subjects || [])[0] || "General",
            message,
            preferredMode: "both",
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-background rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-t-2xl">
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/10 transition-colors">
                        <X size={20} />
                    </button>
                    <div className="flex items-start gap-5">
                        <div className="relative">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                                <AvatarImage src={teacher.profilePic} />
                                <AvatarFallback className="text-3xl font-bold">{teacher.fullName?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {teacher.isVerified && (
                                <CheckCircle2 size={22} className="absolute -bottom-1 -right-1 text-blue-500 fill-white bg-white rounded-full" />
                            )}
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold">{teacher.fullName}</h2>
                            <p className="text-muted-foreground text-sm">{teacher.qualification}</p>
                            <div className="flex items-center gap-1 mt-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className={i < Math.floor(teacher.ratingAvg || 0) ? "fill-yellow-500 text-yellow-500" : "text-gray-200 fill-gray-200"} />
                                ))}
                                <span className="ml-1 text-sm font-semibold">{teacher.ratingAvg?.toFixed(1) || "New"}</span>
                                <span className="text-muted-foreground text-xs">({teacher.totalReviews || 0} reviews)</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {teacher.isVerified && <Badge className="bg-blue-100 text-blue-700 border-blue-300">✓ Verified Teacher</Badge>}
                                {teacher.onlineAvailable && <Badge variant="outline" className="text-emerald-700 border-emerald-300"><Wifi size={12} className="mr-1" /> Online</Badge>}
                                {teacher.offlineAvailable && <Badge variant="outline">Offline</Badge>}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-muted/40 rounded-xl">
                            <Briefcase size={18} className="text-primary mx-auto mb-1" />
                            <p className="font-bold">{teacher.experienceYears || 0}+ yrs</p>
                            <p className="text-xs text-muted-foreground">Experience</p>
                        </div>
                        <div className="text-center p-3 bg-muted/40 rounded-xl">
                            <IndianRupee size={18} className="text-primary mx-auto mb-1" />
                            <p className="font-bold">₹{teacher.tuitionFee || "TBD"}</p>
                            <p className="text-xs text-muted-foreground">Per Hour</p>
                        </div>
                        <div className="text-center p-3 bg-muted/40 rounded-xl">
                            <BookOpen size={18} className="text-primary mx-auto mb-1" />
                            <p className="font-bold">{(teacher.subjects || []).length}</p>
                            <p className="text-xs text-muted-foreground">Subjects</p>
                        </div>
                    </div>

                    {/* Subjects */}
                    <div>
                        <h3 className="font-semibold mb-2 flex items-center gap-2"><Award size={16} className="text-primary" /> Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                            {(teacher.subjects || []).map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin size={15} className="text-primary shrink-0" />
                        <span>{teacher.address || "Location not provided"}</span>
                    </div>

                    {/* Bio */}
                    {teacher.bio && (
                        <div>
                            <h3 className="font-semibold mb-2">About</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">{teacher.bio}</p>
                        </div>
                    )}

                    {/* Teaching Methodology */}
                    {teacher.teachingMethodology && (
                        <div>
                            <h3 className="font-semibold mb-2">Teaching Style</h3>
                            <p className="text-sm text-muted-foreground">{teacher.teachingMethodology}</p>
                        </div>
                    )}

                    {/* Lock section: contact info */}
                    {isUnlocked ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 space-y-2">
                            <div className="flex items-center gap-2 text-green-700 font-semibold">
                                <Unlock size={16} /> Contact Details Unlocked
                            </div>
                            <div className="text-sm space-y-1">
                                <p>📞 Phone: <span className="font-semibold">{teacher.contact || "Not provided"}</span></p>
                                <p>📧 Email: <span className="font-semibold">{teacher.contactEmail || teacher.email}</span></p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-muted/50 border border-dashed rounded-xl p-4 text-center space-y-3">
                            <div className="flex items-center justify-center gap-2 text-muted-foreground">
                                <Lock size={16} /> <span className="font-semibold">Contact details are locked</span>
                            </div>
                            <p className="text-sm text-muted-foreground">Unlock this teacher to see phone number, WhatsApp, and book demo classes.</p>
                            <Button onClick={() => setShowUnlockModal(true)} className="gap-2">
                                <Unlock size={16} /> Unlock Teacher
                            </Button>
                        </div>
                    )}

                    {/* Freemium chat section */}
                    <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                        <h3 className="font-semibold">Send Tuition Request</h3>
                        <textarea
                            className="w-full text-sm border rounded-lg p-3 min-h-[90px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
                            placeholder={`Hi ${teacher.fullName?.split(" ")[0]}, I need tuition for my child in...`}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <Button
                            className="w-full gap-2"
                            onClick={handleSendRequest}
                            disabled={requestMutation.isLoading}
                        >
                            <Send size={15} />
                            {requestMutation.isLoading ? "Sending..." : "Send Request"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Unlock Plans Modal */}
            {showUnlockModal && (
                <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold">Unlock Teacher Profile</h3>
                            <button onClick={() => setShowUnlockModal(false)} className="p-1 rounded-full hover:bg-muted">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-3">
                            {UNLOCK_PLANS.map((plan) => (
                                <div
                                    key={plan.id}
                                    onClick={() => setSelectedPlan(plan.id)}
                                    className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{plan.icon}</span>
                                            <div>
                                                <p className="font-semibold">{plan.label}</p>
                                                <p className="text-xs text-muted-foreground">{plan.description}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-lg text-primary">₹{plan.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button
                            className="w-full mt-6 gap-2"
                            disabled={!selectedPlan}
                            onClick={() => {
                                const plan = UNLOCK_PLANS.find(p => p.id === selectedPlan);
                                if (plan) handleUnlockPayment(plan);
                            }}
                        >
                            <Unlock size={16} /> Pay & Unlock Now
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherProfileModal;
