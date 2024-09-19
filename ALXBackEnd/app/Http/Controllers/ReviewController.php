<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Fetch all reviews (publicly accessible)
    public function index()
    {
        // Fetch all reviews with public user data
        $reviews = Review::with('user:id,first_name,last_name,profile_photo')
        ->orderBy('created_at', 'desc')
        ->get();
        return response()->json($reviews);
    }

    // Store a review (one review per user)
    public function store(Request $request)
    {
        $user = Auth::user();

        // Check if the user already has a review
        if (Review::where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already submitted a review.'], 403);
        }

        // Validate the request
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
            'text' => 'required|string|max:255',
        ]);

        // Create a new review for the authenticated user
        $review = Review::create([
            'user_id' => $user->id,
            'stars' => $validated['stars'],
            'text' => $validated['text'],
        ]);

        return response()->json($review, 201);
    }

    // Get the authenticated user's review
    public function show()
    {
        $user = Auth::user();

        // Retrieve the review of the authenticated user
        $review = Review::where('user_id', $user->id)->first();

        if (!$review) {
            return response()->json(['message' => 'No review found for this user.'], 204);
        }

        return response()->json($review);
    }

    // Update the review of the authenticated user
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $review = Review::where('user_id', $user->id)->find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found.'], 404);
        }

        // Validate the request
        $validated = $request->validate([
            'stars' => 'sometimes|integer|min:1|max:5',
            'text' => 'sometimes|string|max:255',
        ]);

        // Update the review
        $review->update($validated);

        return response()->json($review);
    }

    // Delete the review of the authenticated user
    public function destroy($id)
    {
        $user = Auth::user();
        $review = Review::where('user_id', $user->id)->find($id);

        if (!$review) {
            return response()->json(['message' => 'Review not found.'], 404);
        }

        // Delete the review
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully.']);
    }
}
