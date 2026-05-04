<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminOrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'creator'])->orderBy('created_at', 'desc')->get();
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_email' => 'required|email|exists:users,email',
            'items' => 'required|array|min:1',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        $user = User::where('email', $request->user_email)->firstOrFail();

        return DB::transaction(function () use ($request, $user) {
            $order = Order::create([
                'user_id' => $user->id,
                'created_by' => auth()->id(),
                'status' => 'draft',
                'notes' => $request->notes,
            ]);

            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            $order->recalculateTotal();

            return response()->json($order->load(['user', 'items']), 201);
        });
    }

    public function show($id)
    {
        $order = Order::with(['user', 'creator', 'canceller', 'items'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        
        if (!$order->isEditable()) {
            return response()->json(['message' => 'Order is frozen and cannot be edited.'], 403);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'notes' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($request, $order) {
            $order->update(['notes' => $request->notes]);

            // Replace all items
            $order->items()->delete();
            foreach ($request->items as $item) {
                $order->items()->create([
                    'product_name' => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);
            }

            $order->recalculateTotal();

            return response()->json($order->load(['user', 'items']));
        });
    }

    public function assign($id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status !== 'draft') {
            return response()->json(['message' => 'Only draft orders can be assigned.'], 400);
        }

        $order->transitionTo('assigned');

        // Notification Flood Protection
        $exists = Notification::where('user_id', $order->user_id)
            ->where('type', 'order_assigned')
            ->where('data->order_id', $order->id)
            ->exists();

        if (!$exists) {
            Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order_assigned',
                'data' => [
                    'order_id' => $order->id,
                    'message' => 'A new order has been assigned to you. Please review and confirm.'
                ]
            ]);
        }

        return response()->json($order);
    }

    public function complete($id)
    {
        $order = Order::findOrFail($id);
        
        if ($order->status === 'completed') {
            return response()->json(['message' => 'Order is already completed.'], 400);
        }

        $order->transitionTo('completed');

        // Notification Flood Protection
        $exists = Notification::where('user_id', $order->user_id)
            ->where('type', 'order_completed')
            ->where('data->order_id', $order->id)
            ->exists();

        if (!$exists) {
            Notification::create([
                'user_id' => $order->user_id,
                'type' => 'order_completed',
                'data' => [
                    'order_id' => $order->id,
                    'message' => 'Your order has been completed.'
                ]
            ]);
        }

        return response()->json($order);
    }

    public function cancel(Request $request, $id)
    {
        $request->validate(['cancel_reason' => 'nullable|string']);
        
        $order = Order::findOrFail($id);
        
        if ($order->status === 'cancelled') {
            return response()->json(['message' => 'Order is already cancelled.'], 400);
        }

        $oldStatus = $order->status;
        
        $order->update(['cancel_reason' => $request->cancel_reason]);
        $order->transitionTo('cancelled', auth()->id());

        if ($oldStatus !== 'draft') {
            // Notification Flood Protection
            $exists = Notification::where('user_id', $order->user_id)
                ->where('type', 'order_cancelled')
                ->where('data->order_id', $order->id)
                ->exists();

            if (!$exists) {
                Notification::create([
                    'user_id' => $order->user_id,
                    'type' => 'order_cancelled',
                    'data' => [
                        'order_id' => $order->id,
                        'message' => 'Your order has been cancelled.'
                    ]
                ]);
            }
        }

        return response()->json($order);
    }
}
