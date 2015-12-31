<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Outline;

class OutlineController extends Controller {
    
    public function index(){
        $outlines = Outline::all();
        return $outlines;
    }
    
    public function get($id){
        $outlines = Outline::find($id);
        return $outlines;
    }
}
