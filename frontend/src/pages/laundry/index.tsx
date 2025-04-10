import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LaundryPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        roomNumber: '',
        laundryType: 'mixed_14',
        paymentMethod: 'rozo'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const basePrice = {
                'mixed_14': 28.00,
                'mixed_28': 52.00,
                'separated': 52.00
            }[formData.laundryType];

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    serviceType: 'laundry',
                    vendor: 'angie',
                    basePrice,
                    royaltyFee: basePrice * 0.10, // 10% royalty fee
                }),
            });

            if (response.ok) {
                navigate('/confirmation');
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            alert('Error submitting order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Laundry Service</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Professional laundry service by Angie's Laundry
                    </p>
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-700">
                            📍 Collections & Returns: Forest City Marina Hotel Lobby<br />
                            ⏰ Pickup: 9:00 AM daily (except Wednesday)<br />
                            ⏰ Return: 9:00 AM daily (except Wednesday)
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
                                Room Number
                            </label>
                            <input
                                type="text"
                                id="roomNumber"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="laundryType" className="block text-sm font-medium text-gray-700">
                                Laundry Type
                            </label>
                            <select
                                id="laundryType"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.laundryType}
                                onChange={(e) => setFormData({ ...formData, laundryType: e.target.value })}
                            >
                                <option value="mixed_14">Mixed Wash & Dry (14kgs) - RM28.00</option>
                                <option value="mixed_28">Mixed Wash & Dry (28kgs) - RM52.00</option>
                                <option value="separated">Separated Wash & Dry (2 x 14kgs) - RM52.00</option>
                            </select>
                            <div className="mt-2 text-xs text-gray-500">
                                <p>Temperature Options:</p>
                                <p>• Water: Cold (30°C) / Warm (40°C) / Hot (60°C)</p>
                                <p>• Dryer: Low (70°C) / Medium (80°C) / High (90°C)</p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700">
                                Payment Method
                            </label>
                            <select
                                id="paymentMethod"
                                required
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.paymentMethod}
                                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                            >
                                <option value="rozo">Rozo Pay (rozo.ai)</option>
                                <option value="stripe" disabled>Credit Card - Coming Soon</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Submitting...' : 'Request Laundry'}
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        Effective from 01/03/2025
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LaundryPage;