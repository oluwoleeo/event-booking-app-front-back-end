<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request){
        $rules = [
            'firstname' => 'required|string|min:2|max:25',
            'lastname' => 'required|string|min:2|max:25',
            'email' => 'required|string|email|max:50|unique:users',
            'password' => ['required', 'string', Password::defaults()],
        ];
        $validated = $request->validate($rules);

        $user = User::create(
            [
                'firstname' => $validated['firstname'],
                'lastname' => $validated['lastname'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]
        );

        return response()->json([
            'id' => $user->id
        ],  Response::HTTP_CREATED);
    }

    public function login(Request $request){
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            throw ValidationException::withMessages(
                [
                    'error' => ['The provided credentials are incorrect.']
                ]
            );
        }

        if (!Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'error' => ['The provided credentials are incorrect.']
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }
}
