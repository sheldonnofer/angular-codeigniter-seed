<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;
use App\Congregation;

class CongregationController extends Controller {
    
    public function index(){
        $congregations = Congregation::all();
        return $congregations;
    }
    
    public function get($id){
        $congregations = Congregation::find($id);
        return $congregations;
    }
}
