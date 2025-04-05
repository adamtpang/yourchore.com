import { useState, useEffect } from 'react'
import axios from 'axios'
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'

interface Order {
    id: string
    roomNumber: string
    customerName: string
    status: string
    paymentMethod: string
    notes: string
    createdAt: string
    cost: number
}

const statusOptions = ['Pending', 'Picked Up', 'Washing', 'Drying', 'Folding', 'Delivered']

const statusColors: Record<string, { bg: string; text: string; dot: string }> = {
    'Pending': { bg: 'bg-yellow-50', text: 'text-yellow-800', dot: 'bg-yellow-400' },
    'Picked Up': { bg: 'bg-blue-50', text: 'text-blue-800', dot: 'bg-blue-400' },
    'Washing': { bg: 'bg-purple-50', text: 'text-purple-800', dot: 'bg-purple-400' },
    'Drying': { bg: 'bg-orange-50', text: 'text-orange-800', dot: 'bg-orange-400' },
    'Folding': { bg: 'bg-indigo-50', text: 'text-indigo-800', dot: 'bg-indigo-400' },
    'Delivered': { bg: 'bg-green-50', text: 'text-green-800', dot: 'bg-green-400' },
}

const Dashboard = () => {
    const [orders, setOrders] = useState<Order[]>([])
    const [showNotification, setShowNotification] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/orders')
            setOrders(response.data)
        } catch (error) {
            console.error('Error fetching orders:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            await axios.put(`http://localhost:5000/api/order/${orderId}`, { status: newStatus })
            if (newStatus === 'Delivered') {
                setShowNotification(true)
                setTimeout(() => setShowNotification(false), 3000)
            }
            fetchOrders()
        } catch (error) {
            console.error('Error updating order:', error)
        }
    }

    const totalRevenue = orders.reduce((sum, order) => sum + order.cost, 0)
    const pendingOrders = orders.filter(order => order.status !== 'Delivered').length
    const completedOrders = orders.filter(order => order.status === 'Delivered').length

    return (
        <div className="animate-enter">
            {showNotification && (
                <div className="fixed top-4 right-4 animate-slide-down">
                    <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
                        <span className="mr-2">✨</span>
                        Laundry done!
                    </div>
                </div>
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
                <p className="mt-2 text-gray-600">Manage and track laundry orders</p>
            </div>

            <div className="grid gap-6 mb-8 md:grid-cols-3">
                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                            <p className="text-2xl font-semibold text-gray-900">{pendingOrders}</p>
                        </div>
                    </div>
                </div>

                <div className="card bg-white">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-600">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">Completed Orders</p>
                            <p className="text-2xl font-semibold text-gray-900">{completedOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card bg-white">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                    <button
                        onClick={() => {
                            const csvContent = orders
                                .map(order => Object.values(order).join(','))
                                .join('\n')
                            const blob = new Blob([csvContent], { type: 'text/csv' })
                            const url = window.URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = 'orders.csv'
                            a.click()
                        }}
                        className="btn btn-outline flex items-center"
                    >
                        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                        Export CSV
                    </button>
                </div>

                <div className="table-container">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th scope="col" className="table-header">Room</th>
                                <th scope="col" className="table-header">Customer</th>
                                <th scope="col" className="table-header">Status</th>
                                <th scope="col" className="table-header">Payment</th>
                                <th scope="col" className="table-header">Notes</th>
                                <th scope="col" className="table-header">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        Loading orders...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-4 text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : (
                                orders.map(order => (
                                    <tr key={order.id} className="table-row">
                                        <td className="table-cell font-medium text-gray-900">
                                            {order.roomNumber}
                                        </td>
                                        <td className="table-cell">
                                            {order.customerName}
                                        </td>
                                        <td className="table-cell">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`rounded-full px-3 py-1 text-sm font-medium ${statusColors[order.status]?.bg
                                                    } ${statusColors[order.status]?.text} border-0 cursor-pointer focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                            >
                                                {statusOptions.map(status => (
                                                    <option key={status} value={status}>
                                                        {status}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="table-cell">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                {order.paymentMethod}
                                            </span>
                                        </td>
                                        <td className="table-cell">
                                            {order.notes || '-'}
                                        </td>
                                        <td className="table-cell">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard