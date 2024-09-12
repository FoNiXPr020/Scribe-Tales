<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use App\Models\Story;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\NotificationsEvent;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    /**
     * Retrieves all comments with their associated users.
     *
     * @return \Illuminate\Database\Eloquent\Collection|Comment[] The collection of comments with their associated users.
     */
    public function index($story_id)
    {
        $story_id = Story::where('story_id', $story_id)->first();

        if (is_null($story_id)) {
            return response()->json(['message' => 'Story not found'], 404);
        }

        return Comment::where('story_id', $story_id->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Store a newly created comment in the database.
     *
     * @param Request $request The HTTP request object containing the comment data.
     * @return \Illuminate\Http\JsonResponse A JSON response indicating the success or failure of the comment creation.
     * @throws \Illuminate\Validation\ValidationException If the request data fails validation.
     */
    public function store(Request $request)
    {
        $request->validate([
            'story_id' => 'required|exists:stories,story_id',
            'content' => 'required|string|max:500',
        ]);

        $story_id = Story::where('story_id', $request->story_id)->first();

        // Log::info($story_id);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'story_id' => $story_id->id,
            'content' => $request->content,
        ]);

        $creator = $story_id->user;

        // Log::info($creator);

        if ($creator->id === Auth::id()) {
            return response()->json([$comment->load('user')], 201);
        }

        // Lets create a notification for the creator of the story and broadcast

        $notification = Notification::create([
            'story_id' => $story_id->story_id,
            'user_id' => $creator->id,
            'comment_id' => $comment->id,
            'comment_user_id' => Auth::id(),
            'status' => 'unread',
            'notification_type' => 'comment',
        ]);

        $notify = [
            'creator_id' => $creator->id,
            'notification' => [
                'id' => $notification->id,
                'story_id' => $story_id->story_id,
                'status' => 'unread',
                'notification_type' => 'comment',
                'created_at' => $notification->created_at,
                'comment_user' => $comment->user->only('id', 'first_name', 'last_name', 'profile_photo'),
            ],
            'comment' => $comment->only('id', 'content', 'created_at'),
        ];

        broadcast(new NotificationsEvent($notify))->toOthers();

        return response()->json([$comment->load('user')], 201);
    }

    /**
     * Update a comment.
     *
     * @param Request $request The HTTP request object.
     * @param Comment $comment The comment to update.
     * @return \Illuminate\Http\JsonResponse The JSON response with the status and message.
     */
    public function update(Request $request, Comment $comment)
    {
        // Ensure the authenticated user owns the comment
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Validate the request content
        $request->validate([
            'content' => 'required|string|max:500',
        ]);

        // Update the comment with the new content
        $comment->update([
            'content' => $request->content,
        ]);

        // Return the updated comment with the associated user
        return response()->json($comment->load('user'), 200);
    }


    /**
     * Deletes a comment if the user is authorized to do so.
     *
     * @param Comment $comment The comment to delete.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating the success or failure of the deletion.
     */
    public function destroy(Comment $comment)
    {
        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }
}
