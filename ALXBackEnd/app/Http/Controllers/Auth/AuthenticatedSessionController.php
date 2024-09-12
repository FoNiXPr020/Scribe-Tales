<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use App\Models\User;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     */
    // public function store(LoginRequest $request): Response
    // {
    //     $request->authenticate();

    //     $token = $request->user()->createToken($request->user()->username)->plainTextToken;

    //     return response([
    //         'AuthToken' => $token,
    //         'user' => $request->user()
    //     ]);
    // }

    public function store(Request $request)
    {
        // Validate the input fields
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Get the user credentials
        $credentials = $request->only('email', 'password');
        $user = User::where('email', $request->input('email'))->first();

        // Check if the credentials are valid
        if (!Auth::attempt($credentials)) {
            // Check if the email exists in the database
            if ($user) {
                // Email exists but password is incorrect
                return response()->json(['password' => 'The password is incorrect.'], 401);
            } else {
                // Email does not exist
                return response()->json(['email' => 'The provided credentials are incorrect.'], 401);
            }
        }

        // Generate the token for the authenticated user
        $token = $user->createToken($user->username)->plainTextToken;

        // Return the authenticated user, access token, and token type
        return response()->json([
            'AuthToken' => $token,
            'user' => $user,
            'token_type' => 'Bearer',
        ]);
    }


    /**
     * Destroy an authenticated session.
     *
     * This function deletes the user's tokens, invalidates the session,
     * regenerates a new session token, and returns a success message in JSON format.
     *
     * @param Request $request The HTTP request object.
     * @return \Illuminate\Http\JsonResponse The JSON response with the success message.
     */
    public function destroy(Request $request)
    {
        // Delete the user's tokens
        $request->user()->tokens()->delete();

        // // Invalidate the session
        // $request->session()->invalidate();

        // // Regenerate a new session token
        // $request->session()->regenerateToken();

        // // clear the session
        // Session::flush();

        // Return a success message
        Session::flush();
        return response()->json(['message' => 'Logged out']);
    }
}
