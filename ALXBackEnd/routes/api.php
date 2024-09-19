<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\StoryController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\API\FollowerController;
use App\Http\Controllers\API\LikeController;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\API\NotificationController;
use App\Http\Controllers\ReviewController;

Route::post('/register', [RegisteredUserController::class, 'store']);
Route::post('/login', [AuthenticatedSessionController::class, 'store']);
Route::post('/auth/google', [GoogleController::class, 'loginWithGoogle']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);

Route::middleware('auth:sanctum')->group(function () {
    route::post('/check/follow/{username}', [FollowerController::class, 'checkFollow']);

    Route::post('/follow/{username}', [FollowerController::class, 'follow']);
    Route::delete('/unfollow/{username}', [FollowerController::class, 'unfollow']);
    Route::post('/like/{story}', [LikeController::class, 'like']);
    Route::delete('/unlike/{story}', [LikeController::class, 'unlike']);
});

// Route for auth user profile ApiResource
Route::middleware('auth:sanctum')->group(function () {

    // Authenticated routes | User profile and stories
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get('/user/stories', [StoryController::class, 'userStories']);
    Route::post('/user/profile', [ProfileController::class, 'update']);
    Route::post('/user/password', [ProfileController::class, 'updatePassword']);

    // Authenticated routes | Stories
    Route::apiResource('/stories', StoryController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('/comments', CommentController::class)->only(['store', 'update', 'destroy']);

    // Authenticated routes | Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/mark-all-as-read', [NotificationController::class, 'markAllAsRead']);
    Route::post('/notifications/{notification}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);
});


// Public routes
Route::get('/users/{username}', [UserController::class, 'getUserByUsername']);
Route::get('/users/stories/{username}', [StoryController::class, 'storiesByUser']);
Route::get('/explore', [StoryController::class, 'index']);
Route::get('/explore/{story_id}', [StoryController::class, 'show']);
Route::get('/comments/{story_id}', [CommentController::class, 'index']);
Route::get('/user/followers/{username}', [FollowerController::class, 'getUserFollowers']);
Route::get('/user/likes/{username}', [LikeController::class, 'getUserLikes']);

Route::get('/familiar', [StoryController::class, 'getFamiliarStoriesByType']);

// review routes
Route::get('/reviews', [ReviewController::class, 'index']);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/my-review', [ReviewController::class, 'show']);
    Route::post('/reviews', [ReviewController::class, 'store']);
    Route::post('/reviews/{id}', [ReviewController::class, 'update']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});

require __DIR__.'/auth.php';