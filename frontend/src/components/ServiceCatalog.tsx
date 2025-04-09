import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types/services';

// Icons for different service types
const serviceIcons: Record<string, { icon: string; color: string }> = {
    laundry: {
        icon: '🧺',
        color: 'bg-blue-50 text-blue-600'
    },
    food: {
        icon: '🍽️',
        color: 'bg-green-50 text-green-600'
    },
    cleaning: {
        icon: '🧹',
        color: 'bg-purple-50 text-purple-600'
    },
    maintenance: {
        icon: '🔧',
        color: 'bg-orange-50 text-orange-600'
    }
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => {
    const serviceStyle = serviceIcons[service.id] || { icon: '📦', color: 'bg-gray-50 text-gray-600' };

    return (
        <Link
            to={`/services/${service.id}`}
            className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:shadow-lg
                ${service.isActive ? 'bg-white' : 'bg-gray-50'}`}
        >
            <div className="relative z-10">
                <div className={`inline-block rounded-xl p-3 ${serviceStyle.color}`}>
                    <span className="text-2xl">{serviceStyle.icon}</span>
                </div>

                <h3 className="mt-4 text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.name}
                </h3>

                <p className="mt-2 text-gray-600 line-clamp-2">
                    {service.description}
                </p>

                {!service.isActive && (
                    <span className="mt-3 inline-block px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full font-medium">
                        Coming Soon
                    </span>
                )}

                {service.isActive && (
                    <div className="mt-4 flex items-center text-blue-600">
                        <span className="text-sm font-medium">Learn more</span>
                        <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                )}
            </div>

            <div className={`absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-transparent
                ${service.isActive ? 'to-blue-50/30' : 'to-gray-100/30'} opacity-0 group-hover:opacity-100 transition-opacity`} />
        </Link>
    );
};

export const ServiceCatalog: React.FC = () => {
    const [services, setServices] = React.useState<Service[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        fetch('/api/services')
            .then(res => res.json())
            .then(data => {
                // Add some coming soon services
                const allServices: Service[] = [
                    ...data,
                    {
                        id: 'food',
                        name: 'Food Delivery',
                        description: 'Campus food delivery and meal prep services. Order from local restaurants or get your meals prepped for the week.',
                        isActive: false,
                        comingSoon: true
                    },
                    {
                        id: 'cleaning',
                        name: 'Room Cleaning',
                        description: 'Professional room and dorm cleaning services. Schedule regular cleanings or one-time deep cleans.',
                        isActive: false,
                        comingSoon: true
                    }
                ];
                setServices(allServices);
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load services');
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Campus Life, Simplified
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    From laundry to food delivery, we've got your daily chores covered.
                    Choose a service to get started.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </div>
    );
};