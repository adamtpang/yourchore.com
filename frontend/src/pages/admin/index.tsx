import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Order {
    id: string;
    name: string;
    room: string;
    service: string;
    time: string;
    amountPaid?: number;
    tipAmount?: number;
    royalty?: number;
    status: 'Pending' | 'Picked Up' | 'Delivered';
    paymentMethod: string;
    metadata?: Record<string, any>;
}

const AdminDashboard: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
        // Refresh orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (id: string, status: Order['status']) => {
        try {
            await api.put(`/api/orders/${id}/status`, { status });
            // Update local state for immediate UI feedback
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === id ? { ...order, status } : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status. Please try again.');
        }
    };

    const downloadCsv = () => {
        if (orders.length === 0) {
            alert('No orders to download');
            return;
        }

        // Format orders as CSV
        const headers = ['Name', 'Room', 'Service', 'Paid (RM)', 'Tip (RM)', 'Status', 'Time', 'Royalty (10%)'];
        const csvRows = [
            headers.join(','),
            ...orders.map(order => {
                const date = new Date(order.time);
                return [
                    `"${order.name || 'N/A'}"`,
                    `"${order.room || 'N/A'}"`,
                    `"${order.service || 'N/A'}"`,
                    (order.amountPaid || 0).toFixed(2),
                    (order.tipAmount || 0).toFixed(2),
                    `"${order.status || 'Pending'}"`,
                    `"${date.toLocaleDateString()} ${date.toLocaleTimeString()}"`,
                    (order.royalty || 0).toFixed(2)
                ].join(',');
            })
        ];
        const csvContent = csvRows.join('\n');

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `angie-laundry-orders-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Angie's Laundry Orders</h1>
                    <p className="mt-2 text-gray-600">This page updates automatically when someone pays. You can mark orders as picked up or delivered.</p>
                </div>

                <div className="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div className="flex items-center">
                        {loading && (
                            <div className="text-sm text-gray-500 flex items-center">
                                <div className="w-4 h-4 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-2"></div>
                                Refreshing data...
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={fetchOrders}
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex-1 sm:flex-none"
                        >
                            Refresh
                        </button>

                        <button
                            onClick={downloadCsv}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex-1 sm:flex-none"
                            disabled={orders.length === 0}
                        >
                            Download CSV
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Room
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paid (RM)
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tip (RM)
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Time
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Royalty (10%)
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                                            No orders found yet. When customers place orders, they'll appear here automatically.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.name || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.room || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.service || 'N/A'}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                RM{(order.amountPaid || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                RM{(order.tipAmount || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <select
                                                    value={order.status}
                                                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                                    className={`text-sm rounded px-2 py-1 border
                                                        ${order.status === 'Delivered' ? 'bg-green-50 border-green-200 text-green-800' :
                                                            order.status === 'Picked Up' ? 'bg-yellow-50 border-yellow-200 text-yellow-800' :
                                                                'bg-gray-50 border-gray-200 text-gray-800'}`}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Picked Up">Picked Up</option>
                                                    <option value="Delivered">Delivered</option>
                                                </select>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(order.time).toLocaleDateString()}<br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(order.time).toLocaleTimeString()}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                RM{(order.royalty || 0).toFixed(2)}
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm space-y-1">
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                                                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors w-full text-center"
                                                    disabled={order.status === 'Picked Up' || order.status === 'Delivered'}
                                                >
                                                    Picked Up
                                                </button>
                                                <button
                                                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                    className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors w-full text-center"
                                                    disabled={order.status === 'Delivered'}
                                                >
                                                    Delivered
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;