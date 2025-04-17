import React, { useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'yourchoreUser';

// Service options with corresponding Stripe payment links
const serviceOptions = [
    {
        value: 'Mixed Wash & Dry (14kgs)',
        price: 28,
        description: 'Dark & White - 14kgs/load',
        stripeLink: 'https://buy.stripe.com/3cseXHdDdaMOdUYcMT'
    },
    {
        value: 'Mixed Wash & Dry (28kgs)',
        price: 52,
        description: 'Dark & White - 28kgs/load',
        stripeLink: 'https://buy.stripe.com/3cseXHdDdaMOdUYcMT' // Replace with actual link for this service
    },
    {
        value: 'Separated Wash & Dry',
        price: 52,
        description: 'Dark or White - 2 x 14kgs/load',
        stripeLink: 'https://buy.stripe.com/3cseXHdDdaMOdUYcMT' // Replace with actual link for this service
    },
    {
        value: 'Duvet Wash',
        price: 35,
        description: 'Single duvet washing service',
        stripeLink: 'https://buy.stripe.com/3cseXHdDdaMOdUYcMT' // Replace with actual link for this service
    },
];

const LaundryPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        roomNumber: '',
    });
    const [selectedService, setSelectedService] = useState(serviceOptions[0]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReturningUser, setIsReturningUser] = useState(false);

    // Load user data from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem(STORAGE_KEY);
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                setFormData({
                    name: userData.name || '',
                    roomNumber: userData.roomNumber || '',
                });
                setIsReturningUser(true);
            } catch (error) {
                console.error('Error parsing saved user data:', error);
                // Clear potentially corrupted data
                localStorage.removeItem(STORAGE_KEY);
            }
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [id]: value
        }));
    };

    const handleServiceSelect = (service: typeof serviceOptions[0]) => {
        setSelectedService(service);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Generate a unique order reference
            const orderReference = uuidv4();

            // Save user data to localStorage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

            // Store order details in localStorage for use on the thank you page
            const orderDetails = {
                orderReference,
                name: formData.name,
                room: formData.roomNumber,
                service: selectedService.value,
                price: selectedService.price,
                paymentMethod: 'stripe',
                time: new Date().toISOString(),
                royalty: selectedService.price * 0.1 // 10% of service price
            };
            localStorage.setItem('pendingOrder', JSON.stringify(orderDetails));

            // Create order in our backend
            await api.post('/api/orders', {
                name: formData.name,
                room: formData.roomNumber,
                service: selectedService.value,
                paymentMethod: 'stripe',
                basePrice: selectedService.price,
                royaltyFee: selectedService.price * 0.1, // 10% royalty
                orderReference
            });

            // Redirect to the appropriate Stripe payment link
            window.location.href = selectedService.stripeLink;
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Error submitting order. Please try again.');
            setIsSubmitting(false);
        }
    };

    const clearSavedData = () => {
        localStorage.removeItem(STORAGE_KEY);
        setFormData({
            name: '',
            roomNumber: '',
        });
        setIsReturningUser(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4">
            <div className="max-w-md mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900">Laundry Service</h1>
                    <p className="mt-2 text-gray-600">Quick and easy laundry drop-off</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Select Service</h2>
                        <div className="space-y-3">
                            {serviceOptions.map((service) => (
                                <div
                                    key={service.value}
                                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedService.value === service.value
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-indigo-300'
                                        }`}
                                    onClick={() => handleServiceSelect(service)}
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="service"
                                            checked={selectedService.value === service.value}
                                            onChange={() => handleServiceSelect(service)}
                                            className="h-4 w-4 text-indigo-600"
                                        />
                                        <div className="ml-3 flex-grow">
                                            <div className="font-medium text-gray-900">{service.value}</div>
                                            <div className="text-sm text-gray-500">{service.description}</div>
                                        </div>
                                        <div className="text-indigo-600 font-medium">RM{service.price}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {isReturningUser && (
                        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-100">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="text-sm text-green-800 font-medium">
                                        Welcome back! We've pre-filled your information.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={clearSavedData}
                                        className="mt-1 text-xs text-green-700 hover:text-green-900 underline"
                                    >
                                        Edit saved info
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Jane Smith"
                            />
                        </div>

                        <div>
                            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                Room Number
                            </label>
                            <input
                                type="text"
                                id="roomNumber"
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                value={formData.roomNumber}
                                onChange={handleChange}
                                placeholder="e.g. 202A"
                            />
                        </div>

                        <div className="pt-2">
                            <div className="mb-4">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id="stripe-payment"
                                        name="paymentMethod"
                                        checked={true}
                                        readOnly
                                        className="h-4 w-4 text-indigo-600"
                                    />
                                    <label htmlFor="stripe-payment" className="ml-2 text-sm font-medium text-gray-700">
                                        Pay Online (Stripe)
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center opacity-50">
                                    <input
                                        type="radio"
                                        id="rozo-payment"
                                        name="paymentMethod"
                                        disabled
                                        className="h-4 w-4 text-indigo-600"
                                    />
                                    <label htmlFor="rozo-payment" className="ml-2 text-sm font-medium text-gray-500">
                                        Pay with Rozo (Coming Soon)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : `I've dropped my bag – Pay RM${selectedService.price}`}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <div className="flex items-center justify-center mb-1">
                        <svg className="h-4 w-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs text-gray-500">Secure payment powered by Stripe</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LaundryPage;