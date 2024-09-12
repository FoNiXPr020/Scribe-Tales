<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Update the authenticated user's profile.
     *
     * This endpoint allows users to update various aspects of their profile,
     * including their first name, last name, email, username, region, and/or
     * profile photo and cover.
     *
     * @param Request $request The HTTP request object. The request body should
     *                        contain the fields to be updated, with the
     *                        following optional fields:
     *                        - first_name (string, max 50 characters)
     *                        - last_name (string, max 50 characters)
     *                        - email (string, email format, unique, max 255
     *                          characters)
     *                        - username (string, unique, max 22 characters)
     *                        - region (string, max 50 characters)
     *                        - profile_photo (image, max 2MB)
     *                        - profile_cover (image, max 2MB)
     *                        - password (string, confirmed, min 8 characters)
     * @return UserResource The updated user resource.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->validate([
            'first_name' => 'sometimes|string|min:2|max:20|regex:/^[a-zA-Z]+$/u',
            'last_name' => 'sometimes|string|min:2|max:20|regex:/^[a-zA-Z]+$/u',
            'email' => 'sometimes|email|max:255|unique:users,email,' . $user->id,
            'username' => 'sometimes|string|max:22|unique:users,username,' . $user->id,
            'region' => 'sometimes|string|max:30|regex:/^[a-zA-Z]+$/u',
            'profile_photo' => 'sometimes|image|max:2048|mimes:jpeg,png,jpg',
            'profile_cover' => 'sometimes|image|max:2048|mimes:jpeg,png,jpg'
        ]);

        // Handle profile photo upload
        if ($request->hasFile('profile_photo')) {
            // Delete old profile photo if it exists
            if ($user->profile_photo && Storage::disk('public')->exists(str_replace(url('storage/'), '', $user->profile_photo))) {
                Storage::disk('public')->delete(str_replace(url('storage/'), '', $user->profile_photo));
            }
            $profilePhotoPath = $this->storeFile($request->file('profile_photo'), $user->username, 'profiles');
            $data['profile_photo'] = url("storage/" . $profilePhotoPath);
        }

        // Handle profile cover upload
        if ($request->hasFile('profile_cover')) {
            // Delete old profile cover if it exists
            if ($user->profile_cover && Storage::disk('public')->exists(str_replace(url('storage/'), '', $user->profile_cover))) {
                Storage::disk('public')->delete(str_replace(url('storage/'), '', $user->profile_cover));
            }
            $profileCoverPath = $this->storeFile($request->file('profile_cover'), $user->username, 'covers');
            $data['profile_cover'] = url("storage/" . $profileCoverPath);
        }

        $user->update($data);

        return response()->json($user);
    }

    
    /**
     * Update the user's password.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePassword(Request $request)
    {
        $user = $request->user();
        $request->validate([
            'current_password' => ['required', function ($attribute, $value, $fail) use ($user) {
                if (!Hash::check($value, $user->password)) {
                    $fail('The current password is incorrect.');
                }
            }],
            'password' => ['required', 'confirmed'],
        ]);

        $user->update(['password' => Hash::make($request->password)]);

        return response()->json(['message' => 'Password updated successfully.']);
    }

    /**
     * Store a file and return its path.
     *
     * @param \Illuminate\Http\UploadedFile $file
     * @param string $username
     * @param string $folder
     * @return string
     */
    private function storeFile($file, $username, $folder)
    {
        $filePath = "assets/uploads/{$folder}/" . $username . '.' . Str::random(40) . '.' . $file->getClientOriginalExtension();
        Storage::disk('public')->put($filePath, file_get_contents($file->getRealPath()));
        return $filePath;
    }
}

