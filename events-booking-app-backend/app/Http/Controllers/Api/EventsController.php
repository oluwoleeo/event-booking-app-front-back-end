<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function createCategories(Request $request){
        $validated = $request->validate([
            'name' => 'required|string|max:20',
        ]);

        $category = Category::create(
            [
                'name' => $validated['name'],
                'owner_id' => $request->user()->id,
            ]
        );

        return response()->json([
            'id' => $category->id
        ],  Response::HTTP_CREATED);
    }

    public function getUserCategories(Request $request){
        $defaultUser = User::where('email', env('DEFAULT_USER_EMAIL'))->first();
        $categories = Category::where('owner_id', $defaultUser->id)->get();

        $currentUser = $request->user();
        if ($currentUser->id !== $defaultUser->id) {
            $currentUserCategories = Category::where('owner_id', $currentUser->id)->get();

            $categories = $categories->merge($currentUserCategories);
        }

        return response()->json($categories);
    }
}
