<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EventsController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'register']);
Route::get('/events/categories', [EventsController::class, 'getCategories']);
Route::post('/events', [EventsController::class, 'store']);
Route::get('/events', [EventsController::class, 'index']);
Route::get('/events/user', [EventsController::class, 'getEventsByUserId']);
Route::get('/events/{id}', [EventsController::class, 'show']);
Route::match(['PATCH', 'PUT'], '/events/{event}', [EventsController::class, 'update']);
Route::delete('/events/{event}', [EventsController::class, 'destroy']);
