import React from 'react';
import { Link } from 'react-router-dom';
import yourChoreLogo from '../assets/yourchore-logo.png';

export const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-3">
                    <img
                        src={yourChoreLogo}
                        alt="YourChore"
                        className="h-8 w-auto"
                    />
                    <span className="text-xl font-medium text-gray-900 hidden sm:inline-block">
                        YourChore
                    </span>
                </Link>

                <div className="flex items-center space-x-4">
                    <Link
                        to="/services"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        Services
                    </Link>
                    <Link
                        to="/about"
                        className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        About
                    </Link>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </nav>
        </header>
    );
};