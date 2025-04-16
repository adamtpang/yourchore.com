import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Order {
    id: string;
    metadata: {
        name: string;
        roomNumber: string;
    };
    serviceType: string;
    status: string;
    createdAt: string;
}

const DashboardPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
        // Poll for new orders every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, newStatus: string) => {
        try {
            const response = await api.put(`/api/orders/${orderId}/status`, {
                status: newStatus
            });

            if (response.status === 200) {
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm">
                    <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                        <h2 className="text-lg font-medium text-gray-900">
                            Today's Orders
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {orders.length === 0 ? (
                            <p className="p-4 text-center text-gray-500">No orders yet</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-900">
                                                {order.metadata.name}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                Room {order.metadata.roomNumber}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(order.createdAt).toLocaleString()}
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <select
                                                className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                                value={order.status}
                                                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="picked_up">Picked Up</option>
                                                <option value="delivered">Delivered</option>
                                            </select>

                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'picked_up' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;