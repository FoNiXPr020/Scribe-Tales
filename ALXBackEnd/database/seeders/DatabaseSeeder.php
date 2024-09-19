<?php

namespace Database\Seeders;

use App\Models\Story;
use App\Models\User;
use App\Models\Review;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Review::factory(3)->create();

        User::factory()->create([
            'first_name' => 'FoNiX',
            'last_name'=> '',
            'username' => 'FoNiXPr012',
            'region' => 'Morocco',
            'profile_photo' => null,
            'profile_cover' => null,
            'email' => 'fonix@example.com',
            'password' => '123123123',
        ]);

        User::factory()->create([
            'first_name' => 'Mohamed',
            'last_name'=> 'Barhoun',
            'username' => 'BarhounV2021',
            'region' => 'Morocco',
            'profile_photo' => null,
            'profile_cover' => null,
            'email' => 'barhoun@example.com',
            'password' => '123123123',
        ]);

        User::factory()->create([
            'first_name' => 'Oumaima',
            'last_name'=> 'ALX',
            'username' => 'OumaimaALX',
            'region' => 'Morocco',
            'profile_photo' => null,
            'profile_cover' => null,
            'email' => 'Oumaima@example.com',
            'password' => '123123123',
        ]);

        Story::factory(20)->create();
    }
}
