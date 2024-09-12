"use client";

import Page from "@/Page";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { HeartIcon, MessageCircleIcon } from "@/components/ui/Icons";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";
import { UsersRound } from "lucide-react";
import { formatDate, formatNumbers } from "@/lib/utils";
import { useAuth } from "../contexts/AuthContext";
import { follow, unfollow, getUserFollowers } from "@/services/webApi";

export default function ProfilePage({
  userData,
  setUserData,
  userStories,
  userFamiliar,
  userFollowers,
  setFollowers,
  isLoading,
  isFollowing,
  setIsFollowing,
}) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const updateFollowers = async (username) => {
    const followersData = await getUserFollowers(username);
    setFollowers(
      followersData.status !== 204 ? followersData.data.followers : []
    );
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { from: location } });
    }

    try {
      if (isFollowing) {
        await unfollow(userData?.username);
        setIsFollowing(false);
        setUserData((prevUserData) => ({
          ...prevUserData,
          followers_count: userData?.followers_count - 1,
        }));
        await updateFollowers(userData?.username);
      } else {
        await follow(userData?.username);
        setIsFollowing(true);
        setUserData((prevUserData) => ({
          ...prevUserData,
          followers_count: userData?.followers_count + 1,
        }));
        await updateFollowers(userData?.username);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <Page title={`${userData?.username}`} />
      <main>
        <div className="relative h-[180px] overflow-hidden rounded-b-xl md:h-[280px]">
          <img
            src={
              userData?.profile_cover
                ? userData?.profile_cover
                : "/placeholder.svg"
            }
            alt="Cover Image"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 left-4 rounded-xl bg-background/90 text-muted-foreground hover:bg-background md:bottom-6 md:left-6"
          >
            <HeartIcon className="h-4 w-4 mr-2" />
            <span>{userData?.likes_count} Likes</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="absolute bottom-4 left-32 rounded-xl bg-background/90 text-muted-foreground hover:bg-background md:bottom-6 md:left-36"
          >
            <UsersRound className="h-4 w-4 mr-2" />
            <span>{userData?.followers_count} Followers</span>
          </Button>
        </div>

        <div className="container mx-auto mt-2 max-w-6xl px-4 md:mt-10 md:px-6 grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center justify-center">
              <Avatar className="h-36 w-36 border-4 border-background rounded-full md:h-32 md:w-32">
                <AvatarImage src={userData?.profile_photo || "/placeholder-user.jpg"} />
                <AvatarFallback>{userData?.first_name}</AvatarFallback>
              </Avatar>
            </div>
            <h1 className="mt-4 text-center text-xl font-bold md:text-2xl">
              {userData?.first_name} {userData?.last_name}
            </h1>
            <p className="mt-2 text-center text-muted-foreground">
              @{userData?.username.toLowerCase()}
            </p>
            <p className="mt-2 text-center text-muted-foreground">
              {userData?.region ? userData?.region : "Unknown"}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button
                variant="outline"
                className="w-full rounded-xl"
                onClick={handleFollow}
              >
                <MessageCircleIcon className="h-4 w-4 mr-2" />
                <span>{isFollowing ? "Unfollow" : "Follow"}</span>
              </Button>
            </div>
          </div>

          <div className="md:col-span-2">
            <Tabs defaultValue="stories" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-2">
                <TabsTrigger value="stories">Stories</TabsTrigger>
                <TabsTrigger value="followers">Followers</TabsTrigger>
              </TabsList>
              <TabsContent value="stories">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  {userStories.slice(0, 4).map((story) => (
                    <Link to={`/explore/${story.story_id}`} key={story.id}>
                      <Card className="group rounded-xl mt-2" key={story.id}>
                        <CardContent className="grid mt-4">
                          <h3 className="text-lg font-bold line-clamp-1">
                            {story.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {userData.username.toLowerCase()}
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

                {/* in case of no stories */}
                {!userStories.length && (
                  <Card className="rounded-xl w-full p-5 mt-2">
                    <CardContent className="flex items-center justify-center gap-4 mt-5">
                      <p className="text-center text-sm font-medium">
                        {userData.username} has not created any stories yet.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* in case stories more than 4 */}
                {userStories.length > 4 && (
                  <div className="mt-5 flex justify-center items-center text-sm text-muted-foreground">
                    <Button variant="outline">View All</Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="followers">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                  {userFollowers.slice(0, 6).map((follower) => (
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

                {!userFollowers.length && (
                  <Card className="rounded-xl w-full p-5 mt-2">
                    <CardContent className="flex items-center justify-center gap-4 mt-5">
                      <p className="text-center text-sm font-medium">
                        {userData.username} don't have any followers yet.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {userFollowers.length > 6 && (
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
              {userFamiliar.map((story) => (
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
            {userFamiliar.length === 0 && (
              <div className="flex justify-center w-full">
                <Card className="w-full rounded-xl">
                  <CardContent className="text-center mt-5">
                    <p className="text-sm text-muted-foreground">
                      No Papular stories at the Moment!.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
