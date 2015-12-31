<?php

namespace App\Http\Controllers;
use Response;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Speaker;

class SpeakerController extends Controller {
    
    public function index(){
        $speakers = Speaker::all();
        return $speakers;
    }
    
    public function get($id){
        $speaker = Speaker::findOrFail($id);
        return $speaker;
    }
}
