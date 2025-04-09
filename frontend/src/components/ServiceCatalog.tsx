import React from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../types/services';

// Icons for different service types
const serviceIcons: Record<string, string> = {
    laundry: '🧺',
    food: '🍽️',
    cleaning: '🧹',
    maintenance: '🔧'
};

const ServiceCard: React.FC<{ service: Service }> = ({ service }) => (
    <Link
        to={`/services/${service.id}`}
        className={`block p-6 rounded-lg shadow-md transition-all hover:shadow-lg
      ${service.isActive ? 'bg-white hover:scale-105' : 'bg-gray-50'}`}
    >
        <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{serviceIcons[service.id] || '📦'}</span>
            <div>
                <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                {!service.isActive && (
                    <span className="inline-block px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                        Coming Soon
                    </span>
                )}
            </div>
        </div>
        <p className="text-gray-600">{service.description}</p>
    </Link>
);

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
                        description: 'Campus food delivery and meal prep services',
                        isActive: false,
                        comingSoon: true
                    },
                    {
                        id: 'cleaning',
                        name: 'Room Cleaning',
                        description: 'Professional room and dorm cleaning services',
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
            <div className="text-center text-red-600 py-8">
                <p>{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Services</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map(service => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </div>
    );
};