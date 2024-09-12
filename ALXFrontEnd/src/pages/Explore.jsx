"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import ExploreSkeleton from "@/components/skeletons/ExploreSkeleton";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "@/components/ui/searchfilter";
import AdvancedMotion from "@/components/motions/AdvancedMotion";
import { getStories } from "@/services/storiesApi";

const MotionCardVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Explore() {
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [stories, setStories] = useState([]);

  useEffect(() => {

    const fetchStories = async () => {
      try {
        const response = await getStories();
        setStories(response.data);

        // set loading to 2 second even after fetching stories
        setTimeout(() => {
          setLoading(false);
        }, 1300);
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1300);
      }
    };
    
    fetchStories();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [searchQuery, sortOrder]);

  const handleLoadMore = () => setVisibleCount((prevCount) => prevCount + 4);

  const filteredStories = stories.filter(
    (story) =>
      story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.writer_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.user.first_name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.created_at) - new Date(a.created_at)
      : new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <div className="flex flex-col min-h-dvh">
      <main className="flex-1">
        <section className="w-full py-12 md:py-16">
          <div className="container grid gap-8 px-4 md:px-6">
            <AdvancedMotion direction="top">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center">
                  Explore Stories
                </h2>
                <p className="text-center">
                  Discover a world of captivating tales, written by passionate
                  scribes.
                </p>
                <div className="flex items-center gap-4 justify-center">
                  <Search
                    placeholder="Search..."
                    setSearchQuery={setSearchQuery}
                  />
                  <Filter sortOrder={sortOrder} setSortOrder={setSortOrder} />
                </div>
              </div>
            </AdvancedMotion>

              <motion.div
                variants={MotionCardVariant}
                initial="hidden"
                animate="show"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {loading
                    ? Array.from(new Array(8)).map((_, index) => (
                        <ExploreSkeleton key={index} />
                      ))
                    : filteredStories.slice(0, visibleCount).map((story) => (
                        <Link key={story.story_id} to={story.story_id}>
                          <motion.div
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Card key={story.story_id} className="rounded-xl">
                              <CardContent className="grid gap-4 mt-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="w-10 h-10">
                                    <AvatarImage src={story?.user.profile_photo || "/placeholder-user.jpg"} />
                                    <AvatarFallback>FoNiX</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div className="font-medium">
                                      {story.user.first_name} {story.user.last_name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {story.writer_type}
                                    </div>
                                  </div>
                                </div>
                                <img
                                  src={story.image}
                                  alt="Story Image"
                                  className="rounded-md object-cover aspect-[2/1] rounded-xl"
                                />
                                <div className="space-y-1">
                                  <div className="text-lg font-medium tracking-tight line-clamp-1">
                                    {story.title}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {story.content}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        </Link>
                      ))}
                </div>
              </motion.div>
            
            { filteredStories.length === 0 && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 1.01 }}
              >
                <Card key="no-results" className="rounded-xl w-full">
                  <CardContent className="grid gap-4 mt-4">
                    <div className="space-y-1 flex flex-col items-center">
                      <div className="text-lg font-medium">
                        No Stories Found
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        Sorry, we couldn't find any stories matching your
                        search.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
              
            {visibleCount < filteredStories.length && (
              <AdvancedMotion
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.9 }}
                direction="bottom"
                className="flex justify-center mt-6"
              >
                <Button
                  onClick={handleLoadMore}
                  className="px-6 py-2 rounded-xl"
                >
                  Explore More
                </Button>
              </AdvancedMotion>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
