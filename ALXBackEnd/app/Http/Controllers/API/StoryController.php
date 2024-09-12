<?php

namespace App\Http\Controllers\API;

use App\Models\Story;
use Illuminate\Foundation\Testing\WithConsoleEvents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class StoryController extends Controller
{

    /**
     * Retrieve a list of all stories with user data and likes count.
     *
     * @return \Illuminate\Http\JsonResponse A JSON response containing all stories.
     */
    public function index()
    {
        $stories = Story::withCount('likes')->with('user')->get(); // Return all stories with user data and likes count
        return response()->json($stories);
    }

    /**
     * Store a newly created story in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'image' => 'required',
            'content' => 'required',
            'writer_type' => 'required|string'
        ]);

        // Check if 'image' is a file upload or a URL
        if ($request->hasFile('image')) {
            // Validate image file
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            $profilePhotoPath = $this->storeFile($request->file('image'), $user->username, 'stories');
        } else {
            // Validate image URL
            $request->validate([
                'image' => 'required|string|max:2048',
            ]);

            $profilePhotoPath = $this->storeFile($request->input('image'), $user->username, 'stories');
        }

        $validated['image'] = url("storage/" . $profilePhotoPath);

        $story = Story::create([
            'story_id' => Str::random(40),
            'user_id' => Auth::id(),
            'title' => $validated['title'],
            'image' => $validated['image'],
            'content' => $validated['content'],
            'writer_type' => $validated['writer_type'],
        ]);

        return response()->json($story, 201);
    }


    /**
     * Display the specified story with its user.
     *
     * @param  string  $story_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $story_id)
    {
        Log::info('Authorization Header:', ['Authorization' => $request->header('Authorization')]);

        // Get the authenticated user
        $user = $request->user();
        Log::info('Authenticated User:', ['user' => $user]);

        // Fetch the story along with its user and like count
        $story = Story::with('user')->withCount('likes')->where('story_id', $story_id)->first();

        // Check if the story exists
        if (!$story) {
            Log::error('Story not found:', ['story_id' => $story_id]);
            return response()->json(['error' => 'Story not found'], 404);
        }

        Log::info('Story fetched:', ['story' => $story]);

        // Check if the user is authenticated and then check if they have liked the story
        $isLiked = false;
        if ($user) {
            $isLiked = $story->likes()->where('user_id', $user->id)->exists();
            Log::info('Checking if story is liked:', ['isLiked' => $isLiked, 'user_id' => $user->id]);
        } else {
            Log::info('No authenticated user found.');
        }

        // Add the isLiked attribute to the story
        $story->isLiked = $isLiked;

        Log::info('Final Story Response:', ['story' => $story]);

        // Return the story with the isLiked status
        return response()->json($story);
    }



    /**
     * Update the specified story in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  string  $story_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $story_id)
    {
        $story = Story::where('story_id', $story_id)->first();

        if (!$story || $story->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'image' => 'sometimes|required',
            'content' => 'sometimes|required|string',
            'writer_type' => 'sometimes|required|string'
        ]);

        // Check if 'image' is a file upload or a URL
        if ($request->hasFile('image')) {
            // Validate image file
            $request->validate([
                'image' => 'image|mimes:jpeg,png,jpg|max:2048',
            ]);

            // Remove old image if it exists
            if ($story->image && Storage::disk('public')->exists(str_replace(url('storage/'), '', $story->image))) {
                Storage::disk('public')->delete(str_replace(url('storage/'), '', $story->image));
            }

            $profilePhotoPath = $this->storeFile($request->file('image'), Auth::user()->username, 'stories');
            $validated['image'] = url("storage/" . $profilePhotoPath);
        } elseif ($request->has('image')) {
            // Validate image URL
            $request->validate([
                'image' => 'string|max:2048',
            ]);

            // Remove old image if it exists
            if ($story->image && Storage::disk('public')->exists(str_replace(url('storage/'), '', $story->image))) {
                Storage::disk('public')->delete(str_replace(url('storage/'), '', $story->image));
            }

            $profilePhotoPath = $this->storeFile($request->input('image'), Auth::user()->username, 'stories');
            $validated['image'] = url("storage/" . $profilePhotoPath);
        }

        $story->update($validated);

        return response()->json($story);
    }

    /**
     * Remove the specified story from storage.
     *
     * @param  string $story_id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($story_id)
    {
        $story = Story::where('story_id', $story_id)->first();

        if ($story->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Remove the image if it exists
        if ($story->image && Storage::disk('public')->exists(str_replace(url('storage/'), '', $story->image))) {
            Storage::disk('public')->delete(str_replace(url('storage/'), '', $story->image));
        }

        $story->delete();
        return response()->json(null, 204);
    }

    /**
     * Display a listing of the authenticated user's stories.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function userStories(Request $request)
    {
        $user = $request->user();
        $stories = Story::where('user_id', $user->id)->withCount('likes')->get();

        if (!$stories) {
            return response()->json(['error' => 'Stories not found'], 204);
        }

        return response()->json($stories);
    }

    /**
     * Display a listing of stories by the specified user.
     *
     * @param  string  $username
     * @return \Illuminate\Http\JsonResponse
     */
    public function storiesByUser($username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $stories = Story::where('user_id', $user->id)->withCount('likes')->get();
        return response()->json($stories);
    }

    /**
     * Store the file or download the image from the URL.
     *
     * @param \Illuminate\Http\UploadedFile|string $fileOrUrl
     * @param string $username
     * @param string $folder
     * @return string
     */
    private function storeFile($fileOrUrl, $username, $folder)
    {
        if (is_string($fileOrUrl)) {
            // Handle image URL
            $imageContent = file_get_contents($fileOrUrl);
            $extension = pathinfo($fileOrUrl, PATHINFO_EXTENSION) ?: 'jpg'; // Default to jpg if no extension found
        } else {
            // Handle uploaded file
            $imageContent = file_get_contents($fileOrUrl->getRealPath());
            $extension = $fileOrUrl->getClientOriginalExtension();
        }

        $fileName = $username . '.' . Str::random(40) . '.' . $extension;
        $filePath = "assets/uploads/{$folder}/" . $fileName;
        Storage::disk('public')->put($filePath, $imageContent);

        return $filePath;
    }

    /**
     * Retrieves familiar stories by type.
     *
     * @param Request $request The HTTP request object containing the writer type and limit.
     * @return \Illuminate\Http\JsonResponse The JSON response containing the stories or a message if no stories found.
     */
    public function getFamiliarStoriesByType(Request $request)
    {
        $writerType = $request->input('writer_type') ? "" : $this->getDefaultWriterType();

        $limit = $request->input('limit', 3);

        $stories = Story::where('writer_type', 'like', '%' . $writerType . '%')
            ->inRandomOrder()
            ->limit($limit)
            ->withCount('likes')
            ->with('user')
            ->get();

        return $stories->isEmpty()
            ? response()->json(['message' => 'No stories found'], 204)
            : response()->json($stories);
    }

    /**
     * Retrieves a random default writer type from a predefined array.
     *
     * @return string The randomly selected default writer type.
     */
    public function getDefaultWriterType()
    {
        $default = [
            "Fantasy",
            "Historical Fiction",
            "Sci-Fi",
            "Romance",
            "Dystopian",
            "Mystery",
            "Poetry",
            "Science Fiction",
            "Paranormal",
            "Suspense",
            "Thriller",
            "Fiction",
            "Horror",
        ];

        return $default[array_rand($default)];
    }
}
