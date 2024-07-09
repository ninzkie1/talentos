<?php
namespace App\Http\Controllers;

class AdminController extends Controller
{
    public function index()
    {
        // Logic for admin dashboard or operations
        return response()->json(['message' => 'Welcome, Admin']);
    }
}
