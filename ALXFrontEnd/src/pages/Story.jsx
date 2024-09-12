"use client";

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { HeartIcon, HeartOffIcon } from "@/components/ui/Icons";
import {
  CalendarCheck,
  Send,
  Edit,
  Trash2,
  Loader2,
  MoreVertical,
  X,
} from "lucide-react";
import {
  getStory,
  getComments,
  postComment,
  updateComment,
  deleteComment,
} from "@/services/storiesApi";
import NotFound from "@/pages/404";
import { motion } from "framer-motion";
import { like, unlike, FamiliarStories } from "@/services/webApi";
import {
  CleanType,
  StoriesformatDate,
  formatDate,
  cleanContent,
  cleanDescription,
} from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Familiar from "@/pages/Familiar";
import TextToSpeech from "@/utils/TextToSpeech";

export default function Story() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState(null);
  const [liked, setLiked] = useState(false);
  const [familiar, setFamiliar] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(10);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLoadMoreComments = () => {
    setVisibleComments((prev) => prev + 10); // Increase the number of visible comments by 10
  };

  const PostedSound = (Type) => {
    let audio;
    switch (Type) {
      case "Post":
        audio = new Audio("/sounds/MagicPost.mp3");
        audio.volume = 0.2;
        break;
      case "Update":
        audio = new Audio("/sounds/MagicUpdate.mp3");
        audio.volume = 0.2;
        break;
      case "Delete":
        audio = new Audio("/sounds/MagicDelete.mp3");
        audio.volume = 0.1;
        break;
    }
    audio.loop = false;
    audio.play();
  };

  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const fetchStory = async () => {
    try {
      const response = await getStory(id);
      setLiked(response.data.isLiked);
      setStory(response.data);

      const CleanWriterType = CleanType(response.data.writer_type);
      const familiar = await FamiliarStories(CleanWriterType, 3);
      setFamiliar(familiar.data);

      // Fetch comments
      const commentsResponse = await getComments(id);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error("Error fetching story:", error);
      setStory(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStory();
  }, []);

  const handleLike = async () => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { from: location } });
    }

    try {
      if (liked) {
        await unlike(story.story_id);
      } else {
        await like(story.story_id);
      }

      setLiked(!liked);
      await fetchStory();
    } catch (error) {
      console.error("Error liking/unliking story:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setIsSubmitting(true); // Set loading state
      try {
        const response = await postComment({
          story_id: story.story_id,
          content: newComment,
        });

        console.log(response);
        // Assuming response.data is an array, access the first element
        const newCommentData = response.data[0];
        console.log([newCommentData, ...comments]);

        // Add the new comment object to the comments array
        setComments([newCommentData, ...comments]);
        setNewComment("");
      } catch (error) {
        console.error("Error adding comment:", error);
      } finally {
        PostedSound("Post");
        setEditContent("");
        setEditingCommentId(null); // Reset the editing state
        setIsSubmitting(false); // Remove loading state
      }
    }
  };

  const handleEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    if (commentToEdit) {
      setEditingCommentId(commentId);
      setEditContent(commentToEdit.content);
    }
  };

  const handleUpdateComment = async () => {
    if (editContent.trim()) {
      setIsEditing(true); // Set loading state for editing
      try {
        const updatedComment = await updateComment(editingCommentId, {
          content: editContent,
        });

        console.log(updatedComment);
        console.log(updatedComment.data);
        // Assuming updatedComment.data is an array, access the first element
        const updatedCommentData = updatedComment.data;

        // Update the comment in the comments array
        setComments(
          comments.map((comment) =>
            comment.id === editingCommentId ? updatedCommentData : comment
          )
        );

        // Reset the editing state
        setEditingCommentId(null);
        setEditContent("");
      } catch (error) {
        console.error("Error updating comment:", error);
      } finally {
        PostedSound("Update");
        setIsEditing(false); // Remove loading state for editing
      }
    }
  };

  const handleDeleteComment = async (commentId, e) => {
    e.preventDefault();
    setIsDeleting(true); // Set loading state for deleting
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      PostedSound("Delete");
      setIsDeleting(false); // Remove loading state for deleting
    }
  };

  if (isLoading) {
    return <></>;
  }

  if (!story) {
    return <NotFound />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-2 py-10 md:px-6 lg:px-10 space-y-2 text-center">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
            Explore a Story
          </h2>
          <p className="text-muted-foreground">
            Dive into a captivating tale from our community of writers.
          </p>
        </div>
        <section className="container px-3 py-2 md:py-2 grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            {/* Story Content */}
            <Card className="w-full rounded-xl ">
              <CardContent className="grid gap-4 mt-5">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={
                          story?.user.profile_photo || "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>GP</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-lg font-medium">
                        {story?.user.first_name} {story?.user.last_name}
                      </div>

                      <Link to={`/${story?.user.username.toLowerCase()}`}>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm text-muted-foreground"
                        >
                          @{story?.user.username.toLowerCase()}
                        </motion.div>
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className="flex flex-col gap-2 text-muted-foreground md:flex-col md:items-start">
                      <div className="flex items-center gap-2 md:mt-2">
                        <CalendarCheck className="h-5 w-5" />
                        <span className="block">
                          {formatDate(story?.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HeartIcon className="h-5 w-5" />
                        <span className="block">
                          {story?.likes_count} Likes
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 w-full block sm:hidden">
              <TextToSpeech text={story?.content} />
            </div>

            <Card className="w-full h-5/5 rounded-xl col-span-2">
              <CardContent className="grid mt-5">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-3xl font-medium line-clamp-2">
                      {story?.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 space-x-2 hidden sm:block">
                    <TextToSpeech text={story?.content} />
                  </div>
                </div>
                <CardDescription className="mt-5 text-muted-foreground text-xl whitespace-pre-line">
                  {cleanDescription(story?.content)}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="relative overflow-hidden rounded-xl w-full h-full md:h-96">
            <img
              src={story?.image || "/stroy-placeholder.png"}
              alt="Story Image"
              className="object-cover w-full h-full rounded-xl shadow-xl"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              type="button"
              className="absolute top-4 right-4 p-2 rounded-full shadow-md bg-background hover:bg-muted"
            >
              {liked ? (
                <HeartOffIcon className="w-6 h-6 text-gray-500" />
              ) : (
                <HeartIcon className="w-6 h-6 text-gray-500" />
              )}
            </motion.button>
          </div>
        </section>

        <section className="container px-3 py-8">
          <div className="space-y-4">
            <Card className="w-full rounded-xl">
              <CardContent className="p-4">
                <h3 className="text-2xl font-bold mb-4">Write a Comment</h3>
                <Textarea
                  className="rounded-xl"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  className="mt-2 rounded-xl"
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 animate-spin" size={18} />
                  ) : (
                    <Send className="mr-2" size={18} />
                  )}
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </Button>
              </CardContent>
            </Card>

            {comments.slice(0, visibleComments).map((comment) => (
              <Card
                key={comment.id}
                className="w-full rounded-xl"
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={
                          comment.user?.profile_photo || "/placeholder-user.jpg"
                        }
                      />
                      <AvatarFallback>ST</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {comment.user.first_name} {comment.user.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {comment.updated_at === comment.created_at
                              ? `${StoriesformatDate(comment.created_at)}`
                              : `Edited: ${StoriesformatDate(
                                  comment.updated_at
                                )}`}
                          </p>
                        </div>
                        {comment.user.id === user.id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className=" hover:bg-transparent focus-visible:ring-0"
                                variant="ghost"
                                size="sm"
                              >
                                <MoreVertical className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-xl"
                            >
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleEditComment(comment.id)}
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={(e) =>
                                  handleDeleteComment(comment.id, e)
                                }
                              >
                                {isDeleting ? (
                                  <Loader2 className="mr-2 animate-spin h-4 w-4" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {isDeleting ? "Deleting..." : "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    {editingCommentId === comment.id ? (
                      <div className="mt-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="mb-2"
                        />
                        <Button
                          className="mr-2 rounded-xl"
                          onClick={handleUpdateComment}
                          disabled={isEditing}
                        >
                          {isEditing ? (
                            <Loader2 className="mr-2 animate-spin" size={18} />
                          ) : (
                            <Send className="mr-2" size={18} />
                          )}
                          {isEditing ? "Updating..." : "Update Comment"}
                        </Button>
                        <Button
                          className="rounded-xl"
                          variant="outline"
                          onClick={() => setEditingCommentId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <p className="whitespace-pre-line">
                        {cleanContent(comment.content)}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {comments.length > visibleComments && (
              <div className="flex justify-center mt-4">
                <Button
                  className="rounded-xl"
                  variant="outline"
                  onClick={handleLoadMoreComments}
                >
                  Load More
                </Button>
              </div>
            )}
          </div>
        </section>

        <Familiar familiar={familiar} />
      </main>
    </div>
  );
}
