<?php

Route::get('/', function () {
    return view('index');
});

Route::group(['prefix' => 'api'], function() {
    Route::resource('authenticate', 'AuthenticateController', ['only' => ['index']]);
    
    // Speaker api routes
    Route::resource('speakers', 'SpeakerController', ['only' => ['index']]);
    Route::get('speakers/{id}', 'SpeakerController@get');
    
    // Outline api routes
    Route::resource('outlines', 'OutlineController', ['only' => ['index']]);
    Route::get('outlines/{id}', 'OutlineController@get');
    
    // SpeakerOutline api routes
    Route::resource('speaker_outlines', 'SpeakerOutlineController', ['only' => ['index']]);
    Route::get('speaker_outlines/{id}', 'SpeakerOutlineController@get');
    
    // Congregation api routes
    Route::resource('congregations', 'CongregationController', ['only' => ['index']]);
    Route::get('congregations/{id}', 'CongregationController@get');
    
    Route::post('authenticate', 'AuthenticateController@authenticate');
    Route::get('authenticate/user', 'AuthenticateController@getAuthenticatedUser');
});
