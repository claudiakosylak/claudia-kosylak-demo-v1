import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { userApi } from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

const profileSchema = z.object({
  first_name: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters")
    .regex(
      /^[A-Za-z]+$/,
      "First name must contain only alphabetical characters"
    ),
  last_name: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters")
    .regex(
      /^[A-Za-z]+$/,
      "Last name must contain only alphabetical characters"
    ),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      reset({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const updatedUser = await userApi.updateUser(user.id, data);
      updateUser(updatedUser);

      toast.success("Your profile has been successfully updated");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading state instead of returning null
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isProfileIncomplete = !user.first_name || !user.last_name;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          {isProfileIncomplete
            ? "Please complete your profile information to continue"
            : "Manage your profile information"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your personal details here</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first_name"
                  {...register("first_name")}
                  placeholder="Enter your first name"
                  className={errors.first_name ? "border-destructive" : ""}
                />
                {errors.first_name && (
                  <p className="text-sm text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="last_name"
                  {...register("last_name")}
                  placeholder="Enter your last name"
                  className={errors.last_name ? "border-destructive" : ""}
                />
                {errors.last_name && (
                  <p className="text-sm text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update Profile"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="font-medium">Role</Label>
              <p className="text-sm">{user.role}</p>
            </div>
            <div>
              <Label className="font-medium">Member Since</Label>
              <p className="text-sm">{formatDate(user.created_at)}</p>
            </div>
          </div>

          {user.updated_at && user.updated_at !== user.created_at && (
            <div>
              <Label className="font-medium">Last Updated</Label>
              <p className="text-sm">{formatDate(user.updated_at)}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
