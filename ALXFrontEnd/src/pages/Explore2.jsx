"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, Heart, X } from "lucide-react";
import { Search, Filter } from "@/components/ui/searchfilter";
import { useTheme } from "@/ThemeContext";
import { genreList } from "@/lib/genreList";
import { getStories } from "@/services/storiesApi";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import AdvancedMotion from "@/components/motions/AdvancedMotion";
import ExploreSkeleton2 from "@/components/skeletons/ExploreSkeleton2";
import { motion } from "framer-motion";
import Page from "@/Page";

const MotionCardVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Explore2() {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobile, setIsMobile] = useState(false);
  const [stories, setStories] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);

  const fetchStories = async () => {
    try {
      const response = await getStories();
      console.log(response.data);
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

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    setVisibleCount(8);
  }, [searchTerm, sortBy]);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const handleLoadMore = () => setVisibleCount((prevCount) => prevCount + 4);

  const filteredStories = stories
    .filter(
      (story) =>
        (selectedCategory === "" || story.writer_type === selectedCategory) &&
        (story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          story.writer_type.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
        case "writer_type":
          return a[sortBy].localeCompare(b[sortBy]);
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        default:
          return 0;
      }
    });

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <>
      <Page title="Explore" />
      <div className="flex flex-col mix-h-dvh">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`${
              theme === "dark" ? "bg-muted" : "bg-background"
            } w-56 p-6 shadow-lg transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } ${
              isMobile ? "fixed z-50" : "relative z-30"
            } lg:translate-x-0 top-0 left-0 bottom-0 flex flex-col`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Categories</h2>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="lg:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <ScrollArea className="h-[calc(100vh-150px)]">
              <ScrollBar />
              <nav className="flex flex-col">
                <Button
                  onClick={() => {
                    setSelectedCategory("");
                    toggleSidebar();
                  }}
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  className="w-full justify-start mb-1"
                >
                  All Stories <span className="ml-2">({genreList.length})</span>
                </Button>
                {genreList.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "ghost"
                    }
                    className="w-full justify-start mb-1"
                    onClick={() => {
                      setSelectedCategory(category);
                      if (isMobile) toggleSidebar();
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </nav>
            </ScrollArea>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 overflow-auto mb-12">
            <div className="mb-4 sm:mb-6 sm:flex sm:flex-col text-center">
              <h1 className="text-4xl font-bold">Explore Stories</h1>
              <p className="text-lg text-muted-foreground">
                Discover stories from various categories.
              </p>
            </div>
            <div className="mb-4 flex sm:flex-row items-center gap-2">
              {isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  className="p-3 gap-1 rounded-2xl"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              )}
              <Search
                placeholder="Search..."
                SearchQuery={searchTerm}
                setSearchQuery={setSearchTerm}
              />
              <Filter sortOrder={sortBy} setSortOrder={setSortBy} />
            </div>

            <motion.div
              variants={MotionCardVariant}
              initial="hidden"
              animate="show"
            >
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {loading
                  ? Array.from(new Array(8)).map((_, index) => (
                      <ExploreSkeleton2 key={index} />
                    ))
                  : filteredStories.slice(0, visibleCount).map((story) => (
                      <motion.div
                        whileHover={{ scale: 1.03 }}
                      >
                        <Card
                          key={story.id}
                          className="flex flex-col rounded-2xl"
                        >
                          <CardHeader className="p-0">
                            <Link
                              to={`/explore/${story.story_id}`}
                              key={story.story_id}
                            >
                              <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-48 object-cover rounded-2xl"
                              />
                            </Link>
                          </CardHeader>
                          <CardContent className="flex-1 p-4">
                            <div className="flex items-center mb-2">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={
                                    story.user.profile_photo ||
                                    "/assets/placeholder-user.jpg"
                                  }
                                  alt={
                                    story.user.first_name[0] +
                                    story.user.last_name[0]
                                  }
                                />
                                <AvatarFallback>
                                  {story.user.first_name[0] +
                                    story.user.last_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {story.user.first_name} {story.user.last_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {story.writer_type}
                                </p>
                              </div>
                            </div>
                            <CardTitle className="mb-2 line-clamp-1">
                              {story.title}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {story.content}
                            </p>
                          </CardContent>
                          <CardFooter className="flex justify-between items-center p-4 pt-0">
                            <div className="flex items-center">
                              <Heart className="h-4 w-4 mr-1 text-red-500" />
                              <span className="text-sm">
                                {story.likes_count}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(story.updated_at)}
                            </p>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    ))}
              </div>
            </motion.div>

            {!loading && filteredStories.length === 0 && (
              <Card className="flex flex-col rounded-2xl">
                <CardContent className="flex-1 p-4 text-center">
                  {searchTerm ? (
                    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                      No results found for "{searchTerm}"
                    </h2>
                  ) : (
                    <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                      No stories found
                    </h2>
                  )}
                  <p className="mt-2 text-muted-foreground md:text-xl">
                    Try adjusting your search terms.
                  </p>
                </CardContent>
              </Card>
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
          </main>
        </div>
      </div>
    </>
  );
}
