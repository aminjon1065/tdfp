<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailSubscriber extends Model
{
    /** @use HasFactory<\Database\Factories\EmailSubscriberFactory> */
    use HasFactory;

    protected $fillable = [
        'email',
        'status',
        'locale',
        'source',
        'confirmation_token',
        'unsubscribe_token',
        'subscribed_ip',
        'confirmed_ip',
        'unsubscribed_ip',
        'confirmation_sent_at',
        'confirmed_at',
        'unsubscribed_at',
    ];

    protected $casts = [
        'confirmation_sent_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'unsubscribed_at' => 'datetime',
    ];
}
