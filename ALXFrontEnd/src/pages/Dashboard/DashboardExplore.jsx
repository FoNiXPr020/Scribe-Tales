"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import { formatDate, formatNumbers } from "@/lib/utils";

const DashboardExplore = ({ user, stories, followers }) => {
  return (
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
                        src={follower.profile_photo || "/placeholder-user.jpg"}
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
  );
};

export default DashboardExplore;
