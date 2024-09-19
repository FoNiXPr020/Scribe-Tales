"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadIcon, HeartIcon, XIcon, DiscIcon } from "@/components/ui/Icons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { UsersRound, Loader2 } from "lucide-react";
import { updateProfile } from "@/services/authApi";

const DashboardCover = ({ user, likesCount, followersCount, setUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [Uploading, setUploading] = useState(false);

  const [cropData, setCropData] = useState(null);
  const cropperRef = useRef(null);

  const handleCoverClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
      const file = event.target.files[0];
      setCoverImage(URL.createObjectURL(file));
      setShowModal(true);
    };
    fileInput.click();
  };

  const onCropChange = async () => {
    console.log("Cropping image...");
    try {
      setUploading(true);

      const cropper = cropperRef.current?.cropper;
      const croppedImage = cropper.getCroppedCanvas().toDataURL();

      const response = await fetch(croppedImage);
      const blob = await response.blob();
      const file = new File(
        [blob],
        `${Math.random().toString(36).substring(2, 10)}-image.jpg`,
        { type: blob.type }
      );
      const formData = new FormData();
      formData.append("profile_cover", file);
      const result = await updateProfile(formData);
      console.log(result);
      setUser({ ...user, profile_cover: result.data.profile_cover });
      setCropData(croppedImage);
    } catch (error) {
      console.error("Error updating profile image:", error);
    } finally {
      setUploading(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <div className="relative h-[180px] overflow-hidden rounded-b-xl md:h-[280px]">
        <img
          src={
            cropData ||
            (user.profile_cover ? user.profile_cover : "/assets/placeholder.svg")
          }
          alt="Cover Image"
          width={1920}
          height={1080}
          className="h-full w-full object-cover"
        />
        <Button
          onClick={handleCoverClick}
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4 rounded-full bg-background/90 text-muted-foreground hover:bg-background md:bottom-6 md:right-6"
        >
          <UploadIcon className="h-5 w-5 md:h-5 md:w-5" />
          <span className="sr-only">Upload Cover</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 left-4 rounded-xl bg-background/90 text-muted-foreground hover:bg-background md:bottom-6 md:left-6"
        >
          <HeartIcon className="h-4 w-4 mr-2" />
          <span>{likesCount} Likes</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="absolute bottom-4 left-32 rounded-xl bg-background/90 text-muted-foreground hover:bg-background md:bottom-6 md:left-36"
        >
          <UsersRound className="h-4 w-4 mr-2" />
          <span>{followersCount} Followers</span>
        </Button>
      </div>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-[600px] md:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Crop Cover</DialogTitle>
            <DialogDescription>
              Are you sure you want to apply the changes?
            </DialogDescription>
          </DialogHeader>
          <div className="px-0 py-6">
            <Cropper
              src={coverImage}
              style={{ height: "100%" }}
              viewMode={1}
              aspectRatio={1344 / 280}
              guides={false}
              background={false}
              ref={cropperRef}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => setShowModal(false)}
              disabled={Uploading}
            >
              <XIcon className="h-5 w-5" />
              Close
            </Button>
            <Button
              onClick={onCropChange}
              disabled={Uploading}
              className={`items-center gap-2 ${
                Uploading ? "cursor-not-allowed" : ""
              }`}
            >
              {Uploading ? (
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

export default DashboardCover;
