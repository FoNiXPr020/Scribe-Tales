<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\Story;
use App\Models\User;

class LikeController extends Controller
{
    public function like($story_id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $story = Story::where('story_id', $story_id)->first();

        if (!$story) {
            return response()->json(['message' => 'Story not found'], 404);
        }

        if ($story->likes()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already liked this story'], 400);
        }

        $story->likes()->create(['user_id' => $user->id]);

        return response()->json(['message' => 'Successfully liked the story']);
    }

    public function unlike($story_id)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $story = Story::where('story_id', $story_id)->first();

        if (!$story) {
            return response()->json(['message' => 'Story not found'], 404);
        }

        $like = $story->likes()->where('user_id', $user->id)->first();

        if (!$like) {
            return response()->json(['message' => 'You have not liked this story'], 400);
        }

        $like->delete();

        return response()->json(['message' => 'Successfully unliked the story']);
    }

    public function getUserLikes($username)
    {
        // Get Likes of users in all stories
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get the count of likes on the user's stories
        $likes = $user->stories()->withCount('likes')->get()->sum('likes_count');

        if ($likes === 0) {
            return response()->json(['message' => 'No liked stories found'], 204);
        }

        return response()->json(['likes_count' =>  $likes,]);
    }

    public function getUserLikesWithLikedUsers($username)
    {
        // Get the user by username
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get all the user's stories
        $stories = $user->stories()->with('likes')->get();

        // Initialize count and list
        $likesCount = 0;
        $likingUsers = [];

        // Iterate through each story to get likes count and users who liked the stories
        foreach ($stories as $story) {
            $likesCount += $story->likes->count();
            foreach ($story->likes as $like) {
                $likingUsers[] = $like->user; // Assuming the Like model has a user relationship
            }
        }

        // Check if there are any likes
        if ($likesCount === 0) {
            return response()->json(['message' => 'No liked stories found'], 404);
        }

        return response()->json([
            'likes_count' => $likesCount,
            'users_who_liked' => $likingUsers
        ]);
    }
}
