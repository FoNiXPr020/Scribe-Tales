"use client";

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  getStory,
  getComments,
  postComment,
  updateComment,
  deleteComment,
} from "@/services/storiesApi";
import { like, unlike, FamiliarStories } from "@/services/webApi";
import { Loader2 } from "lucide-react";

// Components
import StoryView from "@/pages/Story/StoryView";
import StoryComments from "@/pages/Story/StoryComments";
import Familiar from "@/pages/Familiar";
import NotFound from "@/pages/404";
import Page from "@/Page";

const Story = () => {
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [story, setStory] = useState(null);
  const [liked, setLiked] = useState(false);
  const [familiar, setFamiliar] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [visibleComments, setVisibleComments] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStory = async () => {
    try {
      console.log("fetching story");
      const response = await getStory(id);
      setLiked(response.data.isLiked);
      setStory(response.data);
    } catch (error) {
      console.error("Error fetching story:", error);
      setStory(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFamiliar = async () => {
    try {
      const response = await FamiliarStories(null, 3);
      setFamiliar(response.data);
    } catch (error) {
      console.error("Error fetching familiar stories:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchFamiliar();
    fetchComments();
  }, [id]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      return navigate("/login", { state: { from: location } });
    }

    try {
      if (liked) {
        await unlike(story.story_id);
        playSound("UnLike");
      } else {
        await like(story.story_id);
        playSound("Like");
      }

      setLiked(!liked);
      await fetchStory();
    } catch (error) {
      console.error("Error liking/unliking story:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!isAuthenticated) {
      return navigate("/login", { state: { from: location } });
    }

    setIsSubmitting(true);
    try {
      const response = await postComment({
        story_id: story.story_id,
        content: newComment,
      });

      setComments([response.data[0], ...comments]);
      setNewComment("");
      playSound("Post");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
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
    if (!editContent.trim()) return;

    setIsEditing(true);
    try {
      const updatedComment = await updateComment(editingCommentId, {
        content: editContent,
      });

      setComments(
        comments.map((comment) =>
          comment.id === editingCommentId ? updatedComment.data : comment
        )
      );

      resetEditState();
      playSound("Update");
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async (commentId, e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      await deleteComment(commentId);
      setComments(comments.filter((comment) => comment.id !== commentId));
      playSound("Delete");
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const resetEditState = () => {
    setEditingCommentId(null);
    setEditContent("");
  };

  const playSound = (type) => {
    const soundMap = {
      Post: "/sounds/MagicPost.mp3",
      Update: "/sounds/MagicUpdate.mp3",
      Delete: "/sounds/MagicDelete.mp3",
      Like: "/sounds/Like.mp3",
      UnLike: "/sounds/UnLike.mp3",
    };
    const audio = new Audio(soundMap[type]);
    audio.volume = type === "Delete" ? 0.1 : 0.2;
    audio.play();
  };

  const handleLoadMoreComments = () => {
    setVisibleComments((prev) => prev + 10);
  };

  if (isLoading) return null;
  if (!story) return <NotFound />;

  return (
    <>
      <Page title={`Story of ${story.user.username}`} />
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

          <StoryView story={story} handleLike={handleLike} liked={liked} />

          {isLoadingComments ? (
            <div className="flex h-32 items-center justify-center">
              <Loader2 className="mx-auto h-6 w-6 animate-spin" />
            </div>
          ) : (
            <StoryComments
              comments={comments}
              handleCommentSubmit={handleCommentSubmit}
              newComment={newComment}
              setNewComment={setNewComment}
              isSubmitting={isSubmitting}
              visibleComments={visibleComments}
              handleLoadMoreComments={handleLoadMoreComments}
              isEditing={isEditing}
              editContent={editContent}
              setEditContent={setEditContent}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              handleEditComment={handleEditComment}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}
              isDeleting={isDeleting}
              user={user}
            />
          )}

          <Familiar familiar={familiar} />
        </main>
      </div>
    </>
  );
};

export default Story;
