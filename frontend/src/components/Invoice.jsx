import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Invoice.css';

const Invoice = ({ order, onClose }) => {
    const [settings, setSettings] = useState(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [contactRes, brandRes] = await Promise.all([
                    axios.get(`${import.meta.env.VITE_API_URL}/settings/contact_info`),
                    axios.get(`${import.meta.env.VITE_API_URL}/settings/navbar_config`)
                ]);
                
                setSettings({
                    contact: contactRes.data.value || {},
                    brand: brandRes.data.value?.brand_name || 'SynergyStack'
                });
            } catch (err) {
                console.error("Failed to load invoice settings", err);
            }
        };
        fetchSettings();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    if (!order) return null;

    return (
        <div className="invoice-overlay">
            <div className="invoice-container">
                <div className="invoice-actions no-print">
                    <button className="btn-secondary" onClick={onClose}>Close</button>
                    <button className="btn-primary" onClick={handlePrint}>🖨 Print Invoice</button>
                </div>

                <div className="invoice-paper">
                    {/* Header */}
                    <div className="invoice-header">
                        <div className="company-info">
                            <h2>{settings?.brand || 'Loading...'}</h2>
                            {settings?.contact && (
                                <>
                                    <p>{settings.contact.address}</p>
                                    <p>{settings.contact.phone}</p>
                                    <p>{settings.contact.email}</p>
                                </>
                            )}
                        </div>
                        <div className="invoice-title">
                            <h1>INVOICE</h1>
                            <p><strong>Order #:</strong> ORD-{String(order.id).padStart(5, '0')}</p>
                            <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <p><strong>Status:</strong> <span className={`status-${order.status}`}>{order.status.toUpperCase()}</span></p>
                        </div>
                    </div>

                    {/* Bill To */}
                    <div className="invoice-bill-to">
                        <h3>Bill To:</h3>
                        <p><strong>{order.user?.name}</strong></p>
                        <p>{order.user?.email}</p>
                    </div>

                    {/* Items Table */}
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Item Description</th>
                                <th>Qty</th>
                                <th>Unit Price</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items?.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>${Number(item.unit_price).toFixed(2)}</td>
                                    <td>${Number(item.subtotal).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="invoice-totals">
                        <div className="total-row grand-total">
                            <span>TOTAL:</span>
                            <span>${Number(order.total_price).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="invoice-footer">
                        <p>Thank you for your business!</p>
                        {order.status !== 'confirmed' && order.status !== 'completed' && (
                            <p className="draft-warning no-print">Note: This is not a final invoice until the order is confirmed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Invoice;
