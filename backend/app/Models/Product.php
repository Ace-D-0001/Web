<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'price',
        'description',
        'image_url',
        'gallery',
        'specs',
        'is_paused',
    ];

    protected $casts = [
        'is_paused' => 'boolean',
        'gallery' => 'json',
        'specs' => 'json',
    ];

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }
}
