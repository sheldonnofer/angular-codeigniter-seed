<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\SpeakerOutline;

class SpeakerOutlineController extends Controller {
    
    public function index(){
        $speaker_outlines = SpeakerOutline::all();
        return $speaker_outlines;
    }
    
    public function get($id){
        $speaker_outlines = SpeakerOutline::find($id);
        return $speaker_outlines;
    }
}
