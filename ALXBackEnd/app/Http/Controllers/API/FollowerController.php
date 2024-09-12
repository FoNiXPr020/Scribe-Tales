<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

use function PHPUnit\Framework\isEmpty;

class FollowerController extends Controller
{
    /**
     * Follows a user with the given username.
     *
     * @param string $username The username of the user to follow.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the result of the follow operation.
     */
    public function follow($username)
    {
        // Get the authenticated user
        $follower = Auth::user();

        // Check if the user is authenticated
        if (!$follower) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Find the user by username
        $connectedUser = User::where('username', $username)->first();

        // Check if the connected user is found
        if (!$connectedUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if the authenticated user is trying to follow themselves
        if ($follower->id === $connectedUser->id) {
            return response()->json(['message' => 'You cannot follow yourself'], 400);
        }

        // Check if the authenticated user is already following the connected user
        if ($follower->following()->where('user_id', $connectedUser->id)->exists()) {
            return response()->json(['message' => 'You are already following this user'], 400);
        }

        // Attach the connected user to the authenticated user's following list
        $follower->following()->attach($connectedUser->id);

        // Return success response
        return response()->json(['message' => 'Successfully followed the user']);
    }

    /**
     * Unfollows a user with the given username.
     *
     * @param string $username The username of the user to unfollow.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the result of the unfollow operation.
     */
    public function unfollow($username)
    {
        // Get the authenticated user
        $follower = auth()->user();

        // Check if the user is authenticated
        if (!$follower) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Find the user by username
        $connectedUser = User::where('username', $username)->first();

        // Check if the connected user is found
        if (!$connectedUser) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Check if the authenticated user is not following the connected user
        if (!$follower->following()->where('user_id', $connectedUser->id)->exists()) {
            return response()->json(['message' => 'You are not following this user'], 400);
        }

        // Detach the connected user from the authenticated user's following list
        $follower->following()->detach($connectedUser->id);

        // Return success response
        return response()->json(['message' => 'Successfully unfollowed the user']);
    }

    /**
     * Retrieves the list of followers of a user with the given username.
     *
     * @param string $username The username of the user to retrieve followers for.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the followers count and list.
     */
    public function getUserFollowers($username)
    {
        // Find the user by username
        $user = User::where('username', $username)->first();

        // Check if the user is found
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Get the list of followers
        $followers = $user->followers()->get();

        // Get the count of followers
        $followersCount = $user->followers()->count();

        // Check if there are any followers
        if ($followers->isEmpty()) {
            return response()->json(['message' => 'No followers found'], 204);
        }

        // Return the followers count and list as a JSON response
        return response()->json([
            'followers_count' => $followersCount, // The count of followers
            'followers' => $followers, // The list of followers
        ]);
    }

    /**
     * Check if the authenticated user is following a user with the given username.
     *
     * @param string $username The username of the user to check if the authenticated user is following.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the result of the check operation (true if following, false if not).
     */
    public function checkFollow($username)
    {
        // Get the authenticated user
        $follower = Auth::user();

        // Find the user by username
        $connectedUser = User::where('username', $username)->first();

        // Check if the connected user is found
        if (!$connectedUser) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Check if the authenticated user is following the connected user
        $isFollowing = $follower->following()->where('user_id', $connectedUser->id)->exists();

        // Return the result of the check as a JSON response
        return response()->json(['isFollowing' => $isFollowing]);
    }
}
