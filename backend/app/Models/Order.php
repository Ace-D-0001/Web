<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'created_by',
        'status',
        'total_price',
        'notes',
        'cancel_reason',
        'assigned_at',
        'confirmed_at',
        'completed_at',
        'cancelled_at',
        'cancelled_by',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'confirmed_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    const ALLOWED_TRANSITIONS = [
        'draft'     => ['assigned', 'cancelled'],
        'assigned'  => ['confirmed', 'cancelled'],
        'confirmed' => ['completed', 'cancelled'],
        'completed' => [],
        'cancelled' => [],
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function canceller()
    {
        return $this->belongsTo(User::class, 'cancelled_by');
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function canTransitionTo(string $newStatus): bool
    {
        return in_array($newStatus, self::ALLOWED_TRANSITIONS[$this->status] ?? []);
    }

    public function transitionTo(string $newStatus, ?int $actorId = null): void
    {
        if (!$this->canTransitionTo($newStatus)) {
            throw new \InvalidArgumentException(
                "Cannot transition from '{$this->status}' to '{$newStatus}'"
            );
        }

        $this->status = $newStatus;

        match ($newStatus) {
            'assigned'  => $this->assigned_at = now(),
            'confirmed' => $this->confirmed_at = now(),
            'completed' => $this->completed_at = now(),
            'cancelled' => function() use ($actorId) {
                $this->cancelled_at = now();
                $this->cancelled_by = $actorId;
            },
            default => null,
        };

        if ($newStatus === 'cancelled') {
            $this->cancelled_at = now();
            $this->cancelled_by = $actorId;
        }

        $this->save();
    }

    public function isEditable(): bool
    {
        return in_array($this->status, ['draft', 'assigned']);
    }

    public function recalculateTotal(): void
    {
        $this->total_price = $this->items()->sum('subtotal');
        $this->save();
    }
}
