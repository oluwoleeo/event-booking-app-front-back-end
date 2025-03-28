<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class EventsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function index(Request $request)
    {
        $eventsBuilder = Event::with('category');
        $queryParams = $request->query();

        if (count($queryParams) > 0){
            $eventsBuilder = Event::with('category');

            $toSkip = ['to_start', 'to_end', 'max_to'];

            foreach ($queryParams as $key => $value) {
                if (in_array($key, $toSkip)) {
                    continue;
                }

                if ($key === 'category') {
                    $category = Category::all()->first(fn($category) => $category->name === $value);

                    if($category) {
                        $eventsBuilder = $eventsBuilder
                            ->where('category_id', $category->id);
                    }
                }

                if ($key === 'max_from') {
                    $to = $queryParams['max_to'] ?? null;

                    if(!$to || $to <= $value){
                        $eventsBuilder = $eventsBuilder
                            ->where('max_capacity', '>=', $value);
                    } else{
                        $eventsBuilder = $eventsBuilder
                            ->whereBetween('max_capacity', [$value, $to]);
                    }
                }

                if ($key === 'from_start' ){
                    $to = $queryParams['to_start'] ?? null;

                    if(!$to || $to <= $value){
                        $eventsBuilder = $eventsBuilder
                            ->where('start_date', '>=', $value);
                    } else{
                        $eventsBuilder = $eventsBuilder
                            ->whereBetween('start_date', [$value, $to]);
                    }
                }

                if ($key === 'from_end'){
                    $to = $queryParams['to_end'] ?? null;

                    if(!$to || $to <= $value){
                        $eventsBuilder = $eventsBuilder
                            ->where('end_date', '>=', $value);
                    } else{
                        $eventsBuilder = $eventsBuilder
                            ->whereBetween('end_date', [$value, $to]);
                    }
                }
            }
        }

        return $eventsBuilder
            ->get()
            ->sortBy('start_date')
            ->values();
    }

    public function show(int $id)
    {
        return Event::with('category')->find($id);
    }

    public function getEventsByUserId(Request $request)
    {
        return Event::with('category')
            ->where('owner_id', $request->user()->id)
            ->get()
            ->sortBy('start_date')
            ->values();
    }

    public function store(Request $request){
        $rules = [
            'name' => 'required|string|min:1|max:25',
            'category' => 'required|string|min:1|max:20',
            'start_date' => 'required|date|after_or_equal:now',
            'end_date' => 'required|date|after:start_date',
            'description' => 'required|string|min:5|max:255',
            'max_capacity' => 'numeric|integer|min:7',
        ];
        $validated = $request->validate($rules);

        $category = Category::all()->first(fn($category) => $category->name === $validated['category']);

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

    public function getCategories()
    {
        return Category::all();
    }
}
