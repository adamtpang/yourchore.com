import React from 'react';
import { Link } from 'react-router-dom';

const ConfirmationPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 flex items-center justify-center">
            <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-3">Payment Confirmed!</h1>
                <p className="text-gray-600 mb-6">
                    Your laundry order has been received. We'll take care of your clothes and notify you when it's ready.
                </p>

                <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                    <h2 className="text-sm font-medium text-gray-700 mb-2">What happens next:</h2>
                    <ol className="text-sm text-gray-600 pl-5 list-decimal">
                        <li className="mb-1">Your dirty laundry will be picked up</li>
                        <li className="mb-1">We'll wash and dry your items</li>
                        <li className="mb-1">You'll be notified when it's ready</li>
                    </ol>
                </div>

                <Link
                    to="/"
                    className="inline-block w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default ConfirmationPage;