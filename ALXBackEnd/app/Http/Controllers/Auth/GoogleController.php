<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\WelcomeMessageMail;

class GoogleController extends Controller
{
    public function loginWithGoogle(Request $request)
    {
        $token = $request->input('token');

        // Get user info from Google
        $response = Http::withToken($token)->get('https://www.googleapis.com/oauth2/v3/userinfo');
        $userInfo = $response->json();

        //dd($userInfo);

        // Check if the user exists
        $user = User::where('email', $userInfo['email'])->first();

        if (!$user) {
            // Create a new user if not exists
            $username = $this->generateUsername($userInfo['name']);
            $user = User::create([
                'google_id' => $userInfo['sub'],
                'first_name' => $userInfo['given_name'] ?? $userInfo['name'],
                'last_name' => $userInfo['family_name'] ?? '',
                'username' => $username,
                'email' => $userInfo['email'],
                'profile_photo' => $userInfo['picture'],
                'profile_cover' => null,
                'password' => Hash::make(Str::random(12)),
            ]);

            Mail::to($user->email)->queue(new WelcomeMessageMail($user));
        } else {
            // Update the user if necessary
            if(is_null($user->google_id)) {
                $user->update(['google_id' => $userInfo['sub']]);
            }
        }

        //$request->session()->regenerate();
        $token = $user->createToken($user->username)->plainTextToken;
        Auth::login($user);

        return response(
            [
                'AuthToken' => $token,
                'user' => $user
            ]
        );
    }

    public function generateUsername($name)
    {
        // Convert the name to a username by appending random characters
        $baseUsername = Str::slug($name);
        $username = $baseUsername . Str::random(5);

        // Ensure the username is unique
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . Str::random(5);
        }

        return $username;
    }
}
