import React from 'react';
import { Link } from 'react-router-dom';

interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const ServiceSelector: React.FC = () => {
  const [services, setServices] = React.useState<Service[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading available services...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {services.map(service => (
        <Link
          key={service.id}
          to={`/${service.id}`}
          className={`p-6 rounded-lg shadow-md transition-transform hover:scale-105
            ${service.isActive ? 'bg-white' : 'bg-gray-100'}`}
        >
          <h2 className="text-xl font-bold mb-2">{service.name}</h2>
          <p className="text-gray-600">{service.description}</p>
          {!service.isActive && (
            <span className="inline-block mt-2 px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
              Coming Soon
            </span>
          )}
        </Link>
      ))}
    </div>
  );
};