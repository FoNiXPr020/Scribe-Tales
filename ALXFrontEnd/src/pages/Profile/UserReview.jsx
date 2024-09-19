"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StarIcon, Loader2 } from "lucide-react";
import { useTheme } from "@/ThemeContext";
import {
  getMyReview,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/webApi";
import { toast } from "react-toastify";

const UserReview = () => {
  const { theme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [review, setReview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      setIsLoading(true);
      try {
        const response = await getMyReview();
        setReview(response.status === 200 ? response.data : null);
        setRating(response.status === 200 ? response.data.stars : 0);
        setContent(response.status === 200 ? response.data.text : "");
      } catch (error) {
        console.error("Error fetching review:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReview();
  }, []);

  const handleCreateReview = async () => {
    setIsLoading(true);
    try {
      const newReview = { stars: rating, text: content };
      const response = await createReview(newReview);
      setReview(response.data);
      setContent("");
      setRating(0);
      setIsEditing(false);
    } catch (error) {
      console.error("Error creating review:", error);
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateReview = async () => {
    setIsLoading(true);
    if (review) {
      try {
        const updatedReview = { stars: rating, text: content };
        const response = await updateReview(review.id, updatedReview);
        setReview(response.data);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating review:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteReview = async () => {
    setIsLoading(true);
    if (review) {
      try {
        await deleteReview(review.id);
        setReview(null);
        setContent("");
        setRating(0);
      } catch (error) {
        console.error("Error deleting review:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStartEdit = () => {
    if (review) {
      setContent(review.text);
      setRating(review.stars);
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (review) {
      setContent(review.text);
      setRating(review.stars);
    } else {
      setContent("");
      setRating(0);
    }
  };

  return (
    <Card
      className={`w-full rounded-xl ${
        theme === "light" ? "bg-background" : "bg-muted"
      }`}
    >
      <CardHeader>
        <CardTitle>Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-gray-500" />
          </div>
        ) : review && !isEditing ? (
          <div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-5 h-5 ${
                    index < review.stars
                      ? "text-orange-400 fill-current dark:text-orange-400"
                      : "text-muted fill-current dark:text-background"
                  }`}
                />
              ))}
            </div>
            <p>{review.text}</p>
          </div>
        ) : isEditing || !review ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, index) => (
                <StarIcon
                  key={index}
                  className={`w-6 h-6 cursor-pointer ${
                    index < rating
                      ? "text-orange-400 fill-current dark:text-orange-400"
                      : "text-muted fill-current dark:text-background"
                  }`}
                  onClick={() => setRating(index + 1)}
                />
              ))}
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your review here..."
              className="w-full"
            />
          </div>
        ) : (
          <p className="text-center">No review yet. Create one now!</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        {review && !isEditing ? (
          <>
            <Button onClick={handleStartEdit} variant="outline">
              Modify
            </Button>
            <Button onClick={handleDeleteReview}>Delete</Button>
          </>
        ) : isEditing ? (
          <>
            <Button onClick={handleCancelEdit} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleUpdateReview}>Update</Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancelEdit} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleCreateReview}>Create</Button>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserReview;
