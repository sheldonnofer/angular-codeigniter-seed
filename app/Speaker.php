<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Speaker extends Model {

    protected $table = 'speakers';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'phone',
        'email',
        'congregation',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        '',
    ];

}
