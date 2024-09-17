<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Story extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'story_id', 'title', 'image', 'content', 'writer_type'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function hasliked()
    {
        return $this->likes()->where('user_id', Auth::id())->exists();
    }
}
