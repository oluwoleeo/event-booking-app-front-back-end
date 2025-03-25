<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
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

        $category = $this->getCategoriesByUser($request)
            ->first(fn($category) => $category->name === $validated['name']);

        if ($category) {
            return response()->json([
                'message' => 'Category already exists'
            ], Response::HTTP_BAD_REQUEST);
        }

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

    public function store(Request $request){
        $rules = [
            'name' => 'required|string|min:1|max:25',
            'category' => 'required|string|min:1|max:20',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after_or_equal:start_date',
            'description' => 'required|string|min:5|max:255',
            'max_capacity' => 'numeric|integer|min:1',
        ];
        $validated = $request->validate($rules);

        $category = $this->getCategoriesByUser($request)
            ->first(fn($category) => $category->name === $validated['category']);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], Response::HTTP_BAD_REQUEST);
        }

        $toInsert = [
            'name' => $validated['name'],
            'category_id' => $category->id,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'description' => $validated['description'],
            'owner_id' => $request->user()->id,
        ];

        if (array_key_exists('max_capacity', $validated)) {
            $toInsert['max_capacity'] = $validated['max_capacity'];
        }

        $event = Event::create($toInsert);

        return response()->json($event, Response::HTTP_CREATED);
    }

    public function getUserCategories(Request $request){
        $categories = $this->getCategoriesByUser($request);

        return response()->json($categories);
    }

    private function getCategoriesByUser(Request $request)
    {
        $defaultUser = User::where('email', env('DEFAULT_USER_EMAIL'))->first();

        return Category::whereIn('owner_id', [$defaultUser->id, $request->user()->id ])->get();
    }
}
