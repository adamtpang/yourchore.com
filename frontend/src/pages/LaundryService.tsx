import React from 'react';
import { ServiceProvider } from '../types/services';

export const LaundryService: React.FC = () => {
    const [providers, setProviders] = React.useState<ServiceProvider[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        // Fetch vendors that provide laundry service
        fetch('/api/vendors?serviceId=laundry')
            .then(res => res.json())
            .then(data => {
                setProviders(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to load providers:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex items-center mb-8">
                <span className="text-4xl mr-4">🧺</span>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Laundry Service</h1>
                    <p className="text-gray-600 mt-2">Professional laundry and dry cleaning services</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center min-h-[200px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {providers.map(provider => (
                        <div key={provider.id} className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-semibold mb-2">{provider.name}</h3>
                            <p className="text-gray-600 mb-4">{provider.description}</p>
                            {provider.pricing && (
                                <p className="text-sm text-gray-500 mb-4">
                                    Starting from {provider.pricing.currency}{provider.pricing.basePrice}
                                </p>
                            )}
                            {provider.rating && (
                                <div className="flex items-center mb-4">
                                    <span className="text-yellow-400">⭐</span>
                                    <span className="ml-1 text-gray-600">{provider.rating.toFixed(1)}</span>
                                </div>
                            )}
                            <button
                                onClick={() => window.location.href = `/services/laundry/${provider.id}`}
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                            >
                                Choose This Provider
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};