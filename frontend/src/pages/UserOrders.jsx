import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Invoice from '../components/Invoice';
import './UserOrders.css';

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showInvoice, setShowInvoice] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch orders", error);
            setLoading(false);
        }
    };

    const fetchOrderDetails = async (id) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${id}`);
            setSelectedOrder(response.data);
        } catch (error) {
            console.error("Failed to fetch order details", error);
        }
    };

    const confirmOrder = async (id) => {
        if (!window.confirm("Are you sure you want to confirm this order? Once confirmed, it cannot be modified.")) return;
        
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/orders/${id}/confirm`);
            fetchOrders();
            fetchOrderDetails(id);
            alert("Order confirmed successfully!");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to confirm order");
        }
    };

    const openInvoice = (order) => {
        setSelectedOrder(order);
        setShowInvoice(true);
    };

    if (loading) {
        return <div className="user-orders-loading">Loading orders...</div>;
    }

    return (
        <div className="user-orders-container">
            <div className="user-orders-header">
                <h1>📦 My Orders</h1>
                <p>View and manage your service packages</p>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <h2>No active orders found</h2>
                    <p>Once our admin assigns an order to you, it will appear here.</p>
                </div>
            ) : (
                <div className="orders-grid">
                    <div className="orders-list">
                        {orders.map(order => (
                            <div 
                                key={order.id} 
                                className={`order-card ${selectedOrder?.id === order.id ? 'active' : ''}`}
                                onClick={() => fetchOrderDetails(order.id)}
                            >
                                <div className="order-header">
                                    <span className="order-id">ORD-{String(order.id).padStart(5, '0')}</span>
                                    <span className={`status-badge status-${order.status}`}>
                                        {order.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="order-body">
                                    <p className="order-date">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                    <p className="order-total">Total: ${Number(order.total_price).toFixed(2)}</p>
                                </div>
                                {order.status === 'assigned' && (
                                    <div className="action-required-notice">Action Required</div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="order-details-pane">
                        {selectedOrder ? (
                            <div className="details-content">
                                <h2>Order Details</h2>
                                
                                <div className="detail-group">
                                    <label>Status</label>
                                    <div className={`status-badge status-${selectedOrder.status}`}>
                                        {selectedOrder.status.toUpperCase()}
                                    </div>
                                </div>

                                <div className="detail-group">
                                    <label>Timeline</label>
                                    <ul className="timeline">
                                        <li>Assigned: {selectedOrder.assigned_at ? new Date(selectedOrder.assigned_at).toLocaleString() : '-'}</li>
                                        <li>Confirmed: {selectedOrder.confirmed_at ? new Date(selectedOrder.confirmed_at).toLocaleString() : '-'}</li>
                                        <li>Completed: {selectedOrder.completed_at ? new Date(selectedOrder.completed_at).toLocaleString() : '-'}</li>
                                        {selectedOrder.cancelled_at && (
                                            <li style={{color: 'var(--danger)'}}>Cancelled: {new Date(selectedOrder.cancelled_at).toLocaleString()}</li>
                                        )}
                                    </ul>
                                </div>

                                <div className="detail-group">
                                    <label>Items</label>
                                    {selectedOrder.items ? (
                                        <table className="items-table">
                                            <thead>
                                                <tr>
                                                    <th>Item</th>
                                                    <th>Qty</th>
                                                    <th>Subtotal</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedOrder.items.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td>{item.product_name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>${Number(item.subtotal).toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th colSpan="2">Total</th>
                                                    <th>${Number(selectedOrder.total_price).toFixed(2)}</th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    ) : (
                                        <p>Loading items...</p>
                                    )}
                                </div>

                                <div className="order-actions">
                                    {selectedOrder.status === 'assigned' && (
                                        <button className="btn-confirm" onClick={() => confirmOrder(selectedOrder.id)}>
                                            ✅ Confirm Order
                                        </button>
                                    )}
                                    <button className="btn-invoice" onClick={() => setShowInvoice(true)}>
                                        🖨 View Invoice
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="select-prompt">
                                Select an order from the list to view details.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showInvoice && selectedOrder && (
                <Invoice order={selectedOrder} onClose={() => setShowInvoice(false)} />
            )}
        </div>
    );
};

export default UserOrders;
