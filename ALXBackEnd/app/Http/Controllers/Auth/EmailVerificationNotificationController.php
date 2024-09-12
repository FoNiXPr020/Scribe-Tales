<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{

    /**
     * Send a new email verification notification.
     *
     * @param Request $request The HTTP request object.
     * @return JsonResponse|RedirectResponse The JSON response containing the redirect URL if the user's email is already verified,
     *                                       otherwise a JSON response with a verification link status and frontend URL with username.
     */
    public function store(Request $request): JsonResponse|RedirectResponse
    {
        // Retrieve the authenticated user
        $user = $request->user();

        // Check if the user's email is already verified
        if ($user->hasVerifiedEmail()) {
            // Redirect to the dashboard, but it's an API, so return the frontend URL
            return response()->json(['redirect_url' => env('FRONTEND_URL') . "/$user->username"], 302);
        }

        // Send email verification notification if not already verified
        $user->sendEmailVerificationNotification();

        // Return the verification link status and frontend URL with username
        return response()->json([
            'message' => 'Verification link sent! Please check your email to verify your account.',
        ]);
    }
}
