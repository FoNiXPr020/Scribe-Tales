<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Story;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Story>
 */
class StoryFactory extends Factory
{
    protected $model = Story::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $genreList = [
            "Fantasy Writer",
            "Historical Fiction",
            "Sci-Fi Writer",
            "Romance Writer",
            "Dystopian Writer",
            "Mystery Writer",
            "Poetry Writer",
            "Science Fiction Writer",
            "Paranormal Writer",
            "Suspense Writer",
            "Thriller Writer",
            "Fiction Writer",
            "Horror Writer",
        ];
       
        return [
            'user_id' => User::factory(),
            'story_id' => Str::random(40),
            'title' => fake()->sentence(4),
            'image' => fake()->imageUrl(1334, 768, 'png'),
            'content' => fake()->paragraph(),
            'writer_type' => $genreList[array_rand($genreList)],
        ];
    }
}
