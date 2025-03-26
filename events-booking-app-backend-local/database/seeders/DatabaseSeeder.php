<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'firstname' => env('DEFAULT_FIRST_NAME'),
            'lastname' => env('DEFAULT_LAST_NAME'),
            'email' => env('DEFAULT_USER_EMAIL'),
        ]);

        $categories = explode(',', env('EVENT_CATEGORIES'));
        foreach ($categories as $category) {
            Category::factory()->create([
                'name' => $category,
            ]);
        }
    }
}
