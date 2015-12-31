<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Congregation extends Model {

    protected $table = 'congregations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'address',
        'city',
        'state',
        'circuit',
        'meeting_day',
        'meeting_time',
        'wt_conductor',
        'talk_coordinator',
        'coordinator_phone',
        'coordinator_email',
        'cobe',
        'cobe_phone',
        'congregation_id',
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
