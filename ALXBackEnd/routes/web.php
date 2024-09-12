<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;

Route::get('/', function () {
    return ['Laravel' => app()->version()];
});

$router->post('/broadcasting/auth', function(Request $req) {
    return Broadcast::auth($req->user());
});

require __DIR__.'/auth.php';
