<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserOrderController extends Controller
{
    private function getUserOrders(Request $request)
    {
        $user = $request->user();
        
        // Return an empty query if no user is found
        if (!$user) {
            return Order::where('id', 0);
        }

        // Users can never see drafts, and only see their own orders
        return Order::where('user_id', $user->id)
                    ->where('status', '!=', 'draft');
    }

    public function index(Request $request)
    {
        $orders = $this->getUserOrders($request)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required',
            'quantity' => 'required|integer|min:1',
            'notes' => 'nullable|string'
        ]);

        $product = Product::findOrFail($request->product_id);

        return DB::transaction(function () use ($request, $product) {
            $order = Order::create([
                'user_id' => auth()->id(),
                'created_by' => auth()->id(),
                'status' => 'assigned', // Automatically assign it so user can confirm/pay
                'notes' => $request->notes,
            ]);

            $order->items()->create([
                'product_name' => $product->title,
                'quantity' => $request->quantity,
                'unit_price' => floatval(preg_replace('/[^0-9.]/', '', $product->price)) ?: 0,
            ]);

            $order->recalculateTotal();

            $admins = User::where('role', 'admin')->get();
            foreach ($admins as $admin) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'new_order_placed',
                    'data' => [
                        'order_id' => $order->id,
                        'message' => auth()->user()->name . ' has placed a new order #' . $order->id
                    ]
                ]);
            }

            return response()->json($order, 201);
        });
    }

    public function show($id)
    {
        $order = $this->getUserOrders(request())->with('items')->findOrFail($id);
        return response()->json($order);
    }

    public function confirm($id)
    {
        $order = $this->getUserOrders(request())->findOrFail($id);
        
        if ($order->status !== 'assigned') {
            return response()->json(['message' => 'Order is already confirmed or processed.'], 400);
        }

        $order->transitionTo('confirmed');

        $admins = User::where('role', 'admin')->get();
        foreach ($admins as $admin) {
            // Notification Flood Protection
            $exists = Notification::where('user_id', $admin->id)
                ->where('type', 'order_confirmed')
                ->where('data->order_id', $order->id)
                ->exists();

            if (!$exists) {
                Notification::create([
                    'user_id' => $admin->id,
                    'type' => 'order_confirmed',
                    'data' => [
                        'order_id' => $order->id,
                        'user_name' => auth()->user()->name,
                        'message' => auth()->user()->name . ' has confirmed order #' . $order->id
                    ]
                ]);
            }
        }

        return response()->json($order);
    }
}
