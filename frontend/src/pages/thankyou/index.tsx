import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface OrderDetails {
  orderReference: string;
  name: string;
  room: string;
  service: string;
  price: number;
  paymentMethod: string;
  time: string;
}

const ThankYouPage: React.FC = () => {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // Get order details from localStorage
    const pendingOrder = localStorage.getItem('pendingOrder');
    if (pendingOrder) {
      try {
        const parsedOrder = JSON.parse(pendingOrder);
        setOrderDetails(parsedOrder);
      } catch (error) {
        console.error('Error parsing order details:', error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Angie will pick up your laundry from the lobby.
          </p>

          {orderDetails && (
            <div className="mb-6 bg-gray-50 p-4 rounded-lg text-left">
              <h3 className="font-medium text-gray-900 mb-2">Order Details:</h3>
              <p className="text-sm text-gray-600">Reference: {orderDetails.orderReference}</p>
              <p className="text-sm text-gray-600">Name: {orderDetails.name}</p>
              <p className="text-sm text-gray-600">Room: {orderDetails.room}</p>
              <p className="text-sm text-gray-600">Service: {orderDetails.service}</p>
              <p className="text-sm text-gray-600">Amount: RM{orderDetails.price.toFixed(2)}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900">Next Steps:</h3>
            <ol className="list-decimal list-inside text-left text-gray-600 space-y-2">
              <li>Your laundry will be collected at 9:00 AM (except Wed).</li>
              <li>It will be washed, dried, and folded with care.</li>
              <li>Your clean laundry will be returned the next day at 9:00 AM.</li>
            </ol>
          </div>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-block px-4 py-2 text-sm font-medium text-indigo-700 hover:text-indigo-800 underline"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;