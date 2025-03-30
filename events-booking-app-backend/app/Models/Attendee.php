<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendee extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $fillable = [
        'ticket_id',
        'first_name',
        'last_name',
    ];

    protected $hidden = [
        'reservation_id',
        'deleted_at'
    ];

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }
}
