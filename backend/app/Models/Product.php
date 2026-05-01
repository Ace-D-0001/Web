<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image_url',
        'is_paused',
    ];

    protected $casts = [
        'is_paused' => 'boolean',
    ];

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }
}
