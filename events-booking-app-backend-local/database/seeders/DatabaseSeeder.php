<?php

namespace Database\Seeders;

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
            'firstname' => 'Default',
            'lastname' => 'User',
            'email' => env('DEFAULT_USER_EMAIL'),
        ])->categories()->create([
            'name' => 'Default'
        ]);
    }
}
