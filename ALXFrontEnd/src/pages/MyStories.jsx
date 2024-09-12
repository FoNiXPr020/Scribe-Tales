import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion } from "framer-motion";
import MyStoriesSkeleton from "@/components/skeletons/MyStoriesSkeleton";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "@/components/ui/searchfilter";
import { getUserStories } from "@/services/authApi";
import { storyDelete } from "@/services/storiesApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2, XIcon, Eye, Pencil, Ellipsis, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDate, formatNumbers } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const MyStories = () => {
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [stories, setStories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await getUserStories();
        setStories(response.data);
        setTimeout(() => setLoading(false), 1300); // Simulate loading
      } catch (error) {
        console.error("Error fetching stories:", error);
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  useEffect(() => {
    setVisibleCount(6);
  }, []);

  const handleLoadMore = () => setVisibleCount((prevCount) => prevCount + 4);

  const filteredStories = stories
    .filter(
      (story) =>
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.writer_type.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at) - new Date(a.created_at)
        : new Date(a.created_at) - new Date(b.created_at)
    );

  const handleDelete = (story) => {
    setSelectedStory(story);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      setLoading(true);
      await storyDelete(selectedStory.story_id);
      const response = await getUserStories();
      setStories(response.data);
    } catch (error) {
      console.error("Error deleting story:", error);
    } finally {
      setIsDeleting(false);
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-dvh">
        <main className="flex-1">
          <section className="w-full py-12 md:py-12">
            <div className="container px-4 md:px-32 flex flex-col justify-center gap-2">
              <div className="space-y-3 mb-6 text-center">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  My Stories
                </h2>
                <p className="text-lg">
                  Discover all of your stories. Edit, delete, and share them
                  with friends.
                </p>
                <div className="flex items-center gap-2 justify-center">
                  <Search
                    SearchQuery={searchQuery}
                    placeholder="Search in my stories..."
                    setSearchQuery={setSearchQuery}
                  />
                  <Filter sortOrder={sortOrder}  setSortOrder={setSortOrder} />
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <MyStoriesSkeleton key={index} />
                  ))}
                </div>
              ) : filteredStories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                  {filteredStories.slice(0, visibleCount).map((story) => (
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      key={story.story_id}
                    >
                      <Card className="rounded-xl">
                        <CardHeader className="flex flex-row justify-between">
                          <div>
                            <CardTitle className="text-lg font-medium line-clamp-1">
                              {story.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground">
                              {story.writer_type}
                            </CardDescription>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted">
                                <Ellipsis className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-lg">
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/explore/${story.story_id}`}
                                  className="flex items-center"
                                >
                                  <Eye
                                    strokeWidth={1.3}
                                    className="h-6 w-6 mr-2"
                                  />
                                  View Story
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/edit-story/${story.story_id}`}
                                  className="flex items-center"
                                >
                                  <Pencil
                                    strokeWidth={1.3}
                                    className="h-6 w-6 mr-2"
                                  />
                                  Edit Story
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDelete(story)}
                                className="flex items-center"
                              >
                                <Trash2
                                  strokeWidth={1.0}
                                  className="h-6 w-6 mr-2"
                                />
                                Delete Story
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardHeader>

                        <CardContent className="grid gap-4">
                          <img
                            src={story.image}
                            alt="Story Image"
                            className="rounded-xl object-cover aspect-[2/1]"
                          />
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {story.content}
                          </p>
                        </CardContent>

                        <CardDescription className="flex items-center justify-between p-2 px-5">
                          <span className="text-sm text-muted-foreground">
                            {formatNumbers(story?.likes_count)} Likes
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(story?.created_at)}
                          </span>
                        </CardDescription>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="flex justify-center"
                >
                  {searchQuery ? (
                    <Card className="rounded-xl w-full">
                      <CardContent className="grid gap-4 mt-4">
                        <div className="space-y-1 flex flex-col items-center">
                          <div className="text-lg font-medium">
                            No Stories Found for this search "{searchQuery}"
                          </div>
                          <p className="text-sm text-muted-foreground">
                            No stories found with the current search criteria.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="rounded-xl w-full">
                      <CardContent className="grid gap-4 mt-4">
                        <div className="space-y-1 flex flex-col items-center">
                          <div className="text-lg font-medium">
                            No Stories available
                          </div>
                          <p className="text-sm text-muted-foreground">
                            You haven't created any stories yet.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </motion.div>
              )}

              {filteredStories.length > visibleCount && (
                <div className="flex justify-center mt-6">
                  <Button className="rounded-xl" onClick={handleLoadMore}>
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this story?
            </DialogDescription>
          </DialogHeader>
          {selectedStory && (
            <div className="px-0 py-6">
              <h3 className="text-xl font-bold">{selectedStory.title}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {selectedStory.content.slice(0, 100)}...
              </p>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => {
                setShowDeleteModal(false);
                setSelectedStory(null);
              }}
            >
              <XIcon className="h-5 w-5" />
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="gap-1 rounded-lg"
              onClick={confirmDelete}
            >
              {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyStories;
