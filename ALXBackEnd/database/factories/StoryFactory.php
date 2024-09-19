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
    protected static $imageIndex = 0;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // List of genre types for the writer
        $genreList = [
            "Fantasy Writer",
            "Historical Fiction Writer",
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

        // List of image URLs, assuming your images are accessible via a public URL
        $imageList = [
            url('storage/images/1.png'),
            url('storage/images/2.png'),
            url('storage/images/3.png'),
            url('storage/images/4.png'),
            url('storage/images/5.png'),
            url('storage/images/6.png'),
            url('storage/images/7.png'),
            url('storage/images/8.png'),
            url('storage/images/9.png'),
            url('storage/images/10.png'),
            url('storage/images/11.png'),
            url('storage/images/12.png'),
            url('storage/images/13.png'),
            url('storage/images/14.png'),
        ];

        // Sequentially pick an image from the list
        $image = $imageList[self::$imageIndex % count($imageList)];
        self::$imageIndex++;

        return [
            'user_id' => User::factory(),
            'story_id' => Str::random(40),
            'title' => $this->faker->sentence(4),
            'image' => $image, // Sequentially assign the image
            'content' => $this->faker->paragraph(),
            'writer_type' => $genreList[self::$imageIndex % count($genreList)], // Sequentially assign a genre
        ];
    }
}
