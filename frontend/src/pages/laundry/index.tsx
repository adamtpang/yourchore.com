import React, { useState } from 'react';
import { api } from '../../utils/api';

const LaundryPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        roomNumber: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Store order in backend
            const response = await api.post('/api/orders', {
                ...formData,
                serviceType: '14kg_mixed',
                paymentMethod: 'stripe',
                basePrice: 28.00,
                royaltyFee: 2.80, // 10% royalty
            });

            if (response.status === 201) {
                // Redirect to Stripe payment link
                window.location.href = 'https://buy.stripe.com/3cseXHdDdaMOdUYcMT';
            } else {
                throw new Error('Failed to submit order');
            }
        } catch (error) {
            alert('Error submitting order. Please try again.');
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">Laundry Service</h2>
                    <p className="mt-2 text-sm text-gray-600">by Angie's Laundry</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-blue-700 text-sm mb-2">
                            <span className="font-medium">Today's Service</span>
                            <span className="bg-blue-100 px-2 py-1 rounded">RM28</span>
                        </div>
                        <p className="text-sm text-blue-600">14kg Mixed Wash & Dry</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
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

                        <div>
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

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center text-xs text-gray-500">
                    Secure payment powered by Stripe
                </div>
            </div>
        </div>
    );
};

export default LaundryPage;