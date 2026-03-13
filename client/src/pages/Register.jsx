import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Icons } from "@/constants/Icons";
import { Input } from "@/components/ui/input";
import { LucideUserPlus2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const Register = () => {
  const form = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email"),
        password: z
          .string()
          .min(8, "Password must be at least 8 characters long")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character"
          ),
        inviteCode: z.string().optional(),
        role: z.enum(["admin", "teacher", "school", "parent"]),
      })
    ),
    defaultValues: {
      role: "teacher",
    },
  });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutate: registerUser, status } = register;
  const isLoading = status === "pending";

  // Map frontend role names to backend Prisma enum values
  const roleToBackend = {
    teacher: "jobSeeker",
    school: "recruiter",
    parent: "parent",
    admin: "admin",
  };

  const handleSubmit = (credentials) => {
    const mappedCredentials = {
      ...credentials,
      role: roleToBackend[credentials.role] || credentials.role,
    };
    registerUser(mappedCredentials, {
      onSuccess: (data) => {
        // Map backend roles back to frontend routes
        const roleMap = {
          jobSeeker: "teacher",
          recruiter: "school",
          parent: "parent",
          admin: "admin",
        };
        const effectiveRole = roleMap[data?.user?.role] || data?.user?.role;
        navigate(`/dashboard/${effectiveRole}`);
      },
      onError: (error) => {
        toast.error("Error!", {
          description: error?.response?.data?.message,
        });
        console.log(error);
      },
    }); // on save button press send data to the apis
  };

  return (
    <div className="mx-auto relative flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
      <div className="flex flex-col w-full items-center justify-stretch space-y-2 text-center">
        <LucideUserPlus2 size={50} className="" />
        <h1 className="text-2xl font-grotesk font-semibold tracking-tight">
          Create an account
        </h1>
        <p className="text-sm font-grotesk font-medium tracking-normal text-muted-foreground">
          Enter your email below to create your account
        </p>
        <div className="grid w-full gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@example.com"
                          {...field}
                          value={field.value ?? ""}
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Email</FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          placeholder="password"
                          type="password"
                          autoCapitalize="none"
                          autoComplete="password"
                          autoCorrect="off"
                          disabled={isLoading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="inviteCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">
                        Enter invite code eg.#9ubn789
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="inviteCode"
                          placeholder="Enter invite code eg.#9ubn789"
                          type="text"
                          autoCapitalize="none"
                          autoComplete="off"
                          autoCorrect="off"
                          disabled={
                            isLoading || !!searchParams.get("inviteCode")
                          }
                          {...field}
                          value={
                            field.value || searchParams.get("inviteCode") || ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Register as</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value || "teacher"}
                          className="flex flex-row space-x-4 h-10 items-center overflow-x-auto whitespace-nowrap"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="teacher" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Teacher
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="school" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              School
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="parent" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Parent
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="admin" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              Admin
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button disabled={isLoading}>
                  {isLoading && (
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign Up with Email
                </Button>
              </div>
            </form>
          </Form>
          {/*  <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Button variant="outline" type="button" disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}{" "}
            Google
          </Button> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
