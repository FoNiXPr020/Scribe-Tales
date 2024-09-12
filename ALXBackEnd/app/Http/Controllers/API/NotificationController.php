<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    // Fetch notifications for the authenticated user
    public function index()
    {
        $user = Auth::user();

        // Only that have status "unread"
        $notifications = Notification::where('user_id', $user->id)
            ->where('status', 'unread')
            ->orderBy('created_at', 'desc')
            ->get();

        // Here i'm loading the user associated with the notification
        $notifications->load([
            'commentUser:id,first_name,last_name,profile_photo',
            'comment:id,content,created_at'
        ]);

        // also load comment of commentUser that made the comment_id

        return response()->json($notifications);
    }


    // Store a new notification (Not going to be used for now)
    public function store(Request $request)
    {
        $user = Auth::user();
        $notification = Notification::create([
            'story_id' => $request->story_id,
            'user_id' => $user->id,
            'status' => 'unread',
            'notification_type' => $request->notification_type,
        ]);

        return response()->json($notification, 201);
    }

    public function update(Notification $notification)
    {
        $user = Auth::user();

        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$notification) {
            return response()->json(['message' => 'Notification not found'], 404);
        }

        Notification::where('id', $notification->id)
            ->where('user_id', $user->id)
            ->update(['status' => 'read']);

        return response()->json(['message' => 'Notification marked as read'], 200);
    }

    public function destroy(Notification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete the notification
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully'], 200);
    }

    public function markAllAsRead()
    {
        $user = Auth::user();

        // Update all notifications of the user to 'read'
        Notification::where('user_id', $user->id)
            ->where('status', 'unread')
            ->update(['status' => 'read']);

        return response()->json(['message' => 'All notifications marked as read'], 200);
    }
}
