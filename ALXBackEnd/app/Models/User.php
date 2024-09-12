<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

/**
 * App\Models\User
 *
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $following
 * @property-read int|null $following_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Models\User[] $followers
 * @property-read int|null $followers_count
 */
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'google_id',
        'first_name',
        'last_name',
        'username',
        'email',
        'password',
        'region',
        'profile_photo',
        'profile_cover',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Retrieve the users that are following the current user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany The users that are following the current user.
     */
    public function followers()
    {
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    /**
     * Retrieve the users that the current user is following.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsToMany
     */
    public function following()
    {
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }

    /**
     * Retrieve the likes associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany The likes associated with the user.
     */
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    /**
     * Retrieve the stories associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany The stories associated with the user.
     */
    public function stories()
    {
        return $this->hasMany(Story::class);
    }

    /**
     * Retrieve the notifications associated with the user.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany The notifications associated with the user.
     */
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function comment()
    {
        return $this->hasMany(Comment::class);
    }
}
