<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendee;
use App\Models\Category;
use App\Models\Event;
use App\Models\Reservation;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class EventsController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            'auth:sanctum',
            // new Middleware('auth:sanctum'),
        ];
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

                /* if ($key === 'start_date'){
                    $eventsBuilder = $eventsBuilder
                        ->where('start_date', '>=', $value);
                }

                if ($key === 'end_date'){
                    $eventsBuilder = $eventsBuilder
                        ->where('end_date', '<=', $value);
                } */
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

    public function store(Request $request)
    {
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

    public function update(Request $request, Event $event){
        if ($request->user()->id !== $event->owner_id){
            return response()->json([
                'message' => 'You cannot edit this event!'
            ], Response::HTTP_FORBIDDEN);
        }

        $validated = $request->validate(
            [
                'name' => 'string|min:1|max:25',
                'category' => 'string|min:1|max:20',
                'start_date' => 'required_with:end_date|date|after_or_equal:now',
                'end_date' => 'required_with:start_date|date|after:start_date',
                'description' => 'string|min:5|max:255',
                'max_capacity' => 'numeric|integer|min:7',
        ]);

        if (array_key_exists('category', $validated)) {
            $category = Category::all()->first(fn($category) => $category->name === $validated['category']);

            if (!$category) {
                return response()->json([
                    'message' => 'Category not found'
                ], Response::HTTP_BAD_REQUEST);
            }

            unset($validated['category']);
            $validated['category_id'] = $category->id;
        }

        $event->update($validated);

        return $event->fresh('category');
    }

    public function destroy(Request $request, Event $event)
    {
        if ($request->user()->id !== $event->owner_id){
            return response()->json([
                'message' => 'You cannot delete this event!'
            ], Response::HTTP_FORBIDDEN);
        }

        $event->delete();

        return response()->json([
            'message' => 'Event deleted'
        ]);
    }

    public function getCategories()
    {
        return Category::all();
    }

    public function createReservation(Request $request, Event $event)
    {
        $rules = [
            'attendees' => 'required|array|min:1',
            'attendees.*.first_name' => 'required|string|min:2|max:25',
            'attendees.*.last_name' => 'required|string|min:2|max:25',
        ];
        $validated = $request->validate($rules);

        if (now() > $event->start_date ){
            return response()->json([
                [
                    'message' => 'Sorry. Reservation failed. This is a past event!',
                ]
            ], Response::HTTP_BAD_REQUEST);
        }

        $currentEventAttendeesCount = $event->attendees()->count();
        $eventAttendeesCountAfterReservation = $currentEventAttendeesCount + count($validated['attendees']);

        if ($eventAttendeesCountAfterReservation > $event->max_capacity){
            return response()->json([
                [
                    'message' => 'Sorry. Reservation failed. Max capacity exceeded!'
                ], Response::HTTP_BAD_REQUEST
            ]);
        }

        $reservation = Reservation::create([
            'event_id' => $event->id,
            'user_id' => $request->user()->id,
        ]);

        $toInsert = [];

        foreach($validated['attendees'] as $key => $value){
            $value['ticket_id'] = ++$currentEventAttendeesCount;
            $value['reservation_id'] = $reservation->id;
            $toInsert[] = $value;
        }

        $attendees = Attendee::insert($toInsert);

        return response()->json($reservation, Response::HTTP_CREATED);
    }
}
