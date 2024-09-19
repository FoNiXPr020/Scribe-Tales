"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import React, { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/ThemeContext";
import { schemaUpdate } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile } from "@/services/authApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { UploadIcon, XIcon, DiscIcon } from "@/components/ui/Icons";

const ProfileUpdate = () => {
  const { theme } = useTheme();
  const { user, setProfileId, setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarCropperRef = useRef(null);
  const [avatarImage, setAvatarImage] = useState(
    user?.profile_photo || "/assets/placeholder-user.jpg"
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      username: user?.username,
      region: user?.region,
    },
    resolver: zodResolver(schemaUpdate),
  });

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    try {
      if (
        data.first_name === user?.first_name &&
        data.last_name === user?.last_name &&
        data.username === user?.username &&
        data.region === user?.region
      ) {
        toast.success("Your Profile already updated.");
        return;
      }

      const response = await updateProfile(data);
      console.log(response);
      if (response.status === 200) {
        setUser(response.data);
        setProfileId(response.data.username);
        toast.success("Profile updated successfully");
      }
    } catch (formErrors) {
      if (formErrors instanceof Error) {
        console.error(formErrors.message);
        toast.error(formErrors.message);
        // Optionally, you can display a global error message
      } else {
        // Set the backend errors in the form
        for (const key in formErrors) {
          setError(key, formErrors[key]);
        }
      }
    }
  });

  const handleAvatarClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      setAvatarImage(URL.createObjectURL(file));
      setShowModal(true);
    };
    fileInput.click();
  };

  const onAvatarCropChange  = async () => {
    try {
      setUploadingAvatar(true);

      const cropper = avatarCropperRef.current?.cropper;
      const croppedImage = cropper.getCroppedCanvas().toDataURL();

      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${Math.random().toString(36).substring(2, 10)}-image.jpg`,
        { type: blob.type }
      );
      const formData = new FormData();
      formData.append("profile_photo", file);
      const result = await updateProfile(formData);
      setUser({ ...user, profile_photo: result.data.profile_photo });
      setAvatarImage(croppedImage);
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setUploadingAvatar(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div
        className={`flex-1 shadow-sm p-6 rounded-xl ${
          theme === "light" ? "bg-background" : "bg-muted"
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24 border">
              <AvatarImage src={avatarImage} />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <button
              className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 hover:bg-primary-hover transition-colors"
              onClick={handleAvatarClick}
            >
              <UploadIcon className="h-5 w-5" />
            </button>
          </div>
          <div className="grid gap-2">
            <div className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {user?.first_name} {user?.last_name}
            </div>
            <div className="text-muted-foreground dark:text-muted-foreground-dark">
              @{user?.username}
            </div>
            <div className="text-muted-foreground dark:text-muted-foreground-dark">
              {user?.region || "Unknown"}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="mt-6 grid gap-4"
        >
          <div className="grid gap-2">
            <Label htmlFor="name">First Name</Label>
            <Input id="first_name" type="text" {...register("first_name")} />
            {errors.first_name && (
              <p className="text-sm text-orange-800">
                {errors.first_name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Last Name</Label>
            <Input id="last_name" type="text" {...register("last_name")} />
            {errors.last_name && (
              <p className="text-sm text-orange-800">
                {errors.last_name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" type="text" {...register("username")} />
            {errors.username && (
              <p className="text-sm text-orange-800">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" type="text" {...register("region")} />

            {errors.region && (
              <p className="text-sm text-orange-800">{errors.region.message}</p>
            )}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Update Profile
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[400px] md:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Crop Avatar</DialogTitle>
            <DialogDescription>
              Adjust your avatar and apply the changes.
            </DialogDescription>
          </DialogHeader>
          <div className="px-0 py-6">
            <Cropper
              src={avatarImage}
              style={{ height: "100%" }}
              viewMode={1}
              aspectRatio={1} // Square aspect ratio for avatars
              guides={false}
              background={false}
              ref={avatarCropperRef}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => setShowModal(false)}
              disabled={uploadingAvatar}
            >
              <XIcon className="h-5 w-5" />
              Cancel
            </Button>
            <Button
              onClick={onAvatarCropChange}
              disabled={uploadingAvatar}
              className={`items-center gap-2 ${
                uploadingAvatar ? "cursor-not-allowed" : ""
              }`}
            >
              {uploadingAvatar ? (
                <>
                  <Loader2 className="h-5 w-5 mx-auto animate-spin" />
                  <span>Applying Changes</span>
                </>
              ) : (
                <>
                  <DiscIcon className="h-4 w-4" />
                  <span>Apply Changes</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfileUpdate;
