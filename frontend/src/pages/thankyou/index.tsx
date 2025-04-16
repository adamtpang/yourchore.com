import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-3">Thank You!</h1>
                <p className="text-gray-600 mb-8">
                    Your laundry order has been received and payment processed successfully.
                    Angie will pick up your laundry bag soon.
                </p>

                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                    <h3 className="font-medium text-blue-800 mb-3">What happens next?</h3>
                    <ol className="text-left space-y-3 text-blue-700">
                        <li className="flex items-start">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 text-blue-700 mr-3 font-semibold text-sm">1</span>
                            <span>Angie will collect your laundry bag from your room</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 text-blue-700 mr-3 font-semibold text-sm">2</span>
                            <span>Your clothes will be washed, dried, and neatly folded</span>
                        </li>
                        <li className="flex items-start">
                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-blue-200 text-blue-700 mr-3 font-semibold text-sm">3</span>
                            <span>Your clean laundry will be delivered back to your room within 24-48 hours</span>
                        </li>
                    </ol>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                    Return to Home
                </Link>
            </div>
        </div>
    );
};

export default ThankYouPage;