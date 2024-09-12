<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'region' => $this->region,
            'profile_photo' => $this->profile_photo,
            'profile_cover' => $this->profile_cover,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}

