<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SpeakerOutline extends Model {

    protected $table = 'speaker_outlines';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'outline',
        'speaker',
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
