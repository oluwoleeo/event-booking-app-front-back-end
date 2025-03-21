<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

         \App\Models\User::factory()->create([
             'firstname' => env('DEFAULT_FIRST_NAME'),
             'lastname' => env('DEFAULT_LAST_NAME'),
             'email' => env('DEFAULT_USER_EMAIL'),
         ])->categories()->create([
             'name' => 'Default',
         ]);
    }
}
