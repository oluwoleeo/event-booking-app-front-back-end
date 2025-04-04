<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/signup', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/events', [EventsController::class, 'store']);
Route::get('/events', [EventsController::class, 'index']);
Route::get('/events/categories', [EventsController::class, 'getCategories']);
Route::get('/events/user', [EventsController::class, 'getEventsByUserId']);
Route::get('/events/reservations', [EventsController::class, 'getUserReservations']);
Route::get('/events/{event}', [EventsController::class, 'show']);
Route::match(['PATCH', 'PUT'], '/events/{event}', [EventsController::class, 'update']);
Route::delete('/events/{event}', [EventsController::class, 'destroy']);
Route::post('/events/{event}/reservation', [EventsController::class, 'createReservation']);
Route::delete('/events/reservation/{reservation}', [EventsController::class, 'deleteReservation']);
