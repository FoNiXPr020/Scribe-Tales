<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    public function definition()
    {
        return [
            'user_id' => User::factory(), // Assuming each review belongs to a user
            'stars' => $this->faker->numberBetween(1, 5),
            'text' => $this->faker->sentence(10), // Generate some fake review text
        ];
    }
}