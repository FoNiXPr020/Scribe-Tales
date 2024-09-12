"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { formatDate, formatNumbers } from "@/lib/utils";

const Familiar = ({ familiar }) => {
  return (
    <>
      <section className="container mt-12 max-w-6xl px-4 md:mt-16 mb-12">
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold md:text-3xl">Familiar Stories</h2>
            <p className="mt-2 text-muted-foreground">
              Explore stories from your favorite typical writers.
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
        </div>
      </section>
    </>
  );
};

export default Familiar;
