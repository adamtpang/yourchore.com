import { useState, useEffect } from 'react';
import axios from 'axios';
import { CurrencyDollarIcon, ShoppingBagIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface RoyaltyStats {
    totalOrders: number;
    totalRevenue: number;
    totalRoyalties: number;
}

const Admin = () => {
    const [stats, setStats] = useState<RoyaltyStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/royalties');
                setStats(response.data);
            } catch (err) {
                setError('Failed to load statistics');
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center">Loading statistics...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="mt-2 text-gray-600">Overview of orders and royalties</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white overflow-hidden shadow-soft rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                <ShoppingBagIcon className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{stats?.totalOrders || 0}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-soft rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        ${stats?.totalRevenue.toFixed(2) || '0.00'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow-soft rounded-lg">
                    <div className="p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                <ChartBarIcon className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Royalties</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">
                                        ${stats?.totalRoyalties.toFixed(2) || '0.00'}
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;