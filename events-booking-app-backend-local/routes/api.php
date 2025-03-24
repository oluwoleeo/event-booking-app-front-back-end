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
Route::get('/events/categories', [EventsController::class, 'getUserCategories']);
Route::post('/events/category', [EventsController::class, 'createCategories']);
