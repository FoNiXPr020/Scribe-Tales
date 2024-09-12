<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class RegisteredUserController extends Controller
{
    public function store(Request $request): JsonResponse
    /**
     * Store a newly created resource in storage.
     *
     * @param Request $request The HTTP request object containing the user data.
     * @return JsonResponse The JSON response containing the authentication token and user data.
     * @throws \Illuminate\Validation\ValidationException If the validation fails.
     */
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z]+$/'],
            'last_name' => ['required', 'string', 'max:50', 'regex:/^[a-zA-Z]+$/'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:' . User::class],
            'username' => ['required', 'string', 'max:22', 'unique:' . User::class, 'regex:/^[a-zA-Z0-9]+$/', function ($value, $fail) {
                if (in_array(strtolower($value), config('reserved_usernames'))) {
                    $fail('The username ' . $value . ' is reserved.');
                }
            }],
            'region' => ['required', 'string', 'max:50'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'username.regex' => 'The username can only contain letters and numbers.'
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'username' => $request->username,
            'region' => $request->region,
            'password' => Hash::make($request->string('password')),
        ]);

        $token = $user->createToken($user->username)->plainTextToken;

        return response()->json([
            'AuthToken' => $token,
            'user' => $user
        ]);
    }
}
