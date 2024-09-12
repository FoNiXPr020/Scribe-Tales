<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;

class UserController extends Controller
{
    public function getUserByUsername($username)
    {
        $user = User::withCount(['followers', 'likes'])->where('username', $username)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Unknown user ' . $username,
                'status' => 404
            ], 404);
        }

        $user->likes_count = $this->getUserLikes($username);

        return response()->json($user);
    }

    private function getUserLikes($username)
    {
        // Get Likes of users in all stories
        $user = User::where('username', $username)->first();

        if (!$user) {
            return $likes = 0;
        }

        // Get the count of likes on the user's stories
        $likes = $user->stories()->withCount('likes')->get()->sum('likes_count');

        if ($likes === 0) {
            return $likes = 0;
        }

        return $likes;
    }
}
