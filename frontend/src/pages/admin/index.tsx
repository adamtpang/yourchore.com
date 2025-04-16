import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Order {
    id: string;
    name: string;
    room: string;
    service: string;
    time: string;
    amountPaid: number;
    royalty: number;
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
        const headers = ['Name', 'Room', 'Service', 'Amount (RM)', 'Royalty (RM)', 'Status', 'Date', 'Time'];
        const csvRows = [
            headers.join(','),
            ...orders.map(order => {
                const date = new Date(order.time);
                return [
                    `"${order.name}"`,
                    `"${order.room}"`,
                    `"${order.service}"`,
                    order.amountPaid.toFixed(2),
                    order.royalty.toFixed(2),
                    `"${order.status}"`,
                    date.toLocaleDateString(),
                    date.toLocaleTimeString()
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
                    <div className="spinner mb-4"></div>
                    <p className="text-gray-600">Loading orders...</p>
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
                                <div className="spinner-sm mr-2"></div>
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
                                        Customer
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Service
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date/Time
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500">
                                            No orders found yet. When customers place orders, they'll appear here automatically.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                                <div className="text-sm text-gray-500">Room: {order.room}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.service}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">RM{order.amountPaid.toFixed(2)}</div>
                                                <div className="text-xs text-gray-500">Royalty: RM{order.royalty.toFixed(2)}</div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {new Date(order.time).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {new Date(order.time).toLocaleTimeString()}
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                                    ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'Picked Up' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex gap-2">
                                                    {order.status !== 'Picked Up' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'Picked Up')}
                                                            className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 transition-colors"
                                                        >
                                                            Mark Picked Up
                                                        </button>
                                                    )}

                                                    {order.status !== 'Delivered' && (
                                                        <button
                                                            onClick={() => updateOrderStatus(order.id, 'Delivered')}
                                                            className="px-2 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors"
                                                        >
                                                            Mark Delivered
                                                        </button>
                                                    )}
                                                </div>
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