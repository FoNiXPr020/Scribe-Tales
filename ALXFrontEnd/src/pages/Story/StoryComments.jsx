import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Edit, Trash2, Loader2, MoreVertical } from "lucide-react";
import { StoriesformatDate, cleanContent } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const StoryComments = ({
  comments,
  handleCommentSubmit,
  newComment,
  setNewComment,
  isSubmitting,
  visibleComments,
  handleLoadMoreComments,
  handleEditComment,
  isEditing,
  editContent,
  setEditContent,
  handleUpdateComment,
  editingCommentId,
  setEditingCommentId,
  handleDeleteComment,
  isDeleting,
  user,
}) => {
  return (
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

      
        {!comments.length ? (
          <div className="flex justify-center mt-4">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />
          </div>
        ) : (
          comments.slice(0, visibleComments).map((comment) => (
            <Card key={comment.id} className="w-full rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={comment.user?.profile_photo || "/placeholder-user.jpg"}
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
                            : `Edited: ${StoriesformatDate(comment.updated_at)}`}
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
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleEditComment(comment.id)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={(e) => handleDeleteComment(comment.id, e)}
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
          ))
        )}

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
  );
};

export default StoryComments;
