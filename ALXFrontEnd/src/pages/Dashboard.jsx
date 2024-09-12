"use client";

import React, { useState, useEffect, useRef } from "react";
import Page from "@/Page";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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

import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { useAuth } from "../contexts/AuthContext";
import {
  PenLineIcon,
  BadgePlus,
  UsersRound,
  Loader2,
  PlusIcon,
} from "lucide-react";
import { getUserStories } from "@/services/authApi";
import { formatDate, formatNumbers } from "@/lib/utils";
import {
  FamiliarStories,
  getUserFollowers,
  getUserLikes,
} from "@/services/webApi";
import { updateProfile } from "@/services/authApi";

export default function Dashboard() {
  const { loading, user, setUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState([]);
  const [familiar, setFamiliar] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [LikesCount, setLikesCount] = useState(0);
  const [coverImage, setCoverImage] = useState(null);
  const [Uploading, setUploading] = useState(false);

  const [cropData, setCropData] = useState(null);
  const cropperRef = useRef(null);

  const fetchUserStories = async () => {
    try {
      const response = await getUserStories();
      setStories(response.status !== 200 ? [] : response.data);
      const followers = await getUserFollowers(user.username);
      const likes = await getUserLikes(user.username);
      const { data, status } = followers;
      setFollowers(status !== 204 ? data.followers : []);
      setFollowersCount(status !== 204 ? data.followers_count : 0);
      setLikesCount(likes.status !== 204 ? likes.data.likes_count : 0);
      const familiar = await FamiliarStories(null, 3);
      setFamiliar(familiar.status !== 200 ? [] : familiar.data);
    } catch (error) {
      console.error("Error fetching user stories:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserStories();
  }, [user]);

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

  if (loading || isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <Page title="Dashboard" />
      <main>
        <div className="relative h-[180px] overflow-hidden rounded-b-xl md:h-[280px]">
          <img
            src={
              cropData ||
              (user.profile_cover ? user.profile_cover : "/placeholder.svg")
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
            <span>{LikesCount} Likes</span>
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

        <div className="container mx-auto mt-2 max-w-6xl px-4 md:mt-10 md:px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <Avatar className="h-36 w-36 border-4 border-background rounded-full md:h-32 md:w-32">
                  <AvatarImage
                    src={user?.profile_photo || "/placeholder-user.jpg"}
                  />
                  <AvatarFallback>FONIX</AvatarFallback>
                </Avatar>
              </div>
              <h1 className="mt-4 text-center text-xl font-bold md:text-2xl">
                {user?.first_name} {user?.last_name}
              </h1>
              <p className="mt-4 text-center text-muted-foreground">
                @{user?.username?.toLowerCase()}
              </p>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="grid grid-cols-2 gap-4">
                <Link to="/create-story">
                  <Button variant="outline" className="rounded-xl">
                    <BadgePlus className="h-4 w-4 mr-2" />
                    <span>Create Story</span>
                  </Button>
                </Link>
                <Link to="/profile">
                  <Button variant="outline" className="rounded-xl">
                    <PenLineIcon className="h-4 w-4 mr-2" />
                    <span>Editing Profile</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className={`grid w-full grid-cols-2 md:grid-cols-2`}>
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
              </TabsList>

              <TabsContent value="stories">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  {stories.slice(0, 4).map((story) => (
                    <Link to={`/explore/${story.story_id}`} key={story.id}>
                      <Card className="group rounded-xl mt-2" key={story.id}>
                        <CardContent className="grid mt-4">
                          <h3 className="text-lg font-bold line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {user.username.toLowerCase()}
                          </p>
                          <img
                            src={story.image}
                            alt="Story Cover"
                            width={400}
                            height={225}
                            className="mt-4 aspect-video rounded-md object-cover rounded-xl"
                          />
                        </CardContent>
                        <CardFooter className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {story.content}
                          </p>
                        </CardFooter>
                        <div className="flex items-center justify-between p-2 px-5">
                          <div className="rounded-full hover:bg-muted">
                            {formatNumbers(story?.likes_count)} Likes
                          </div>
                          <p className="text-sm text-muted-foreground text-right">
                            {formatDate(story?.created_at)}
                          </p>
                        </div>
                      </Card>
                    </Link>
                  ))}

                  {!stories.length && (
                    <Link to={`/create-story`}>
                      <Card className="group rounded-xl mt-2 flex flex-col items-center justify-center h-[200px] sm:h-[350px] cursor-pointer hover:bg-background transition-colors">
                        <CardContent className="text-center flex flex-col items-center">
                          <PlusIcon className="w-12 h-12 mb-4 text-muted-foreground" />
                          <h3 className="text-lg font-bold">
                            Create Your First Story
                          </h3>
                          <p className="text-sm text-muted-foreground mt-2">
                            Click here to start writing
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  )}
                </div>

                {stories.length > 4 && (
                  <div className="mt-5 flex justify-center items-center text-sm text-muted-foreground">
                    <Link to="/my-stories">
                      <Button variant="outline">View All</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followers">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  {followers.slice(0, 6).map((follower) => (
                    <Link
                      to={`/${follower.username}`}
                      key={follower.id}
                      className="group"
                    >
                      <Card className="rounded-xl">
                        <CardContent className="flex items-center gap-4 mt-5">
                          <Avatar className="h-12 w-12 border-2 border-background">
                            <AvatarImage
                              src={
                                follower.profile_photo ||
                                "/placeholder-user.jpg"
                              }
                            />
                            <AvatarFallback>GP</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="text-lg font-medium">
                              {follower.first_name} {follower.last_name}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              @{follower.username.toLowerCase()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                {!followers.length && (
                  <Card className="rounded-xl w-full p-5 mt-2">
                    <CardContent className="flex items-center justify-center gap-4 mt-5">
                      <p className="text-center text-sm font-medium">
                        You don't have any followers yet.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {followers.length > 6 && (
                  <div className="mt-5 flex justify-center items-center text-sm text-muted-foreground">
                    <Link to="/followers">
                      <Button variant="outline">View All</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <section className="container mt-12 max-w-6xl px-4 md:mt-16 mb-12">
          <div className="space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold md:text-3xl">
                Papular Stories
              </h2>
              <p className="mt-2 text-muted-foreground">
                Explore stories from your favorite writers.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3">
              {familiar.map((story) => (
                <Link to={`/explore/${story.story_id}`} key={story.id}>
                  <Card className="group rounded-xl" key={story.id}>
                    <CardContent className="grid mt-8">
                      <h3 className="text-lg font-bold line-clamp-1">
                        {story.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        by {story.user.username.toLowerCase()}
                      </p>
                      <img
                        src={story.image}
                        alt="Story Cover"
                        width={400}
                        height={225}
                        className="mt-4 aspect-video rounded-md object-cover rounded-xl"
                      />
                    </CardContent>
                    <CardFooter className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {story.content}
                      </p>
                    </CardFooter>
                    <div className="flex items-center justify-between p-2 px-5">
                      <div className="rounded-full hover:bg-muted">
                        {formatNumbers(story?.likes_count)} Likes
                      </div>
                      <p className="text-sm text-muted-foreground text-right">
                        {formatDate(story?.created_at)}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
            {familiar.length === 0 && (
              <div className="flex justify-center w-full">
                <Card className="w-full rounded-xl">
                  <CardContent className="text-center mt-5">
                    <p className="text-sm text-muted-foreground">
                      No papular stories at the Moment!.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>

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
      </main>
    </>
  );
}
