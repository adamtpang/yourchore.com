import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LaundryPage from './pages/laundry';
import ConfirmationPage from './pages/confirmation';
import DashboardPage from './pages/dashboard';
import './App.css'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YourChore</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Available Now</h2>
          <Link
            to="/laundry"
            className="flex items-center p-4 border border-green-100 rounded-lg bg-green-50 hover:bg-green-100"
          >
            <span className="text-2xl mr-3">🧺</span>
            <div>
              <h3 className="font-medium text-gray-900">Laundry Service</h3>
              <p className="text-sm text-gray-500">by Angie • From RM28/load</p>
            </div>
          </Link>

          <div className="mt-6 pt-6 border-t">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
            <div className="space-y-3">
              <div className="flex items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                <span className="text-2xl mr-3">🍽️</span>
                <p className="text-sm text-gray-500">Food Delivery • Q2 2024</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4 text-center">
          <Link
            to="/dashboard"
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            Vendor Dashboard →
          </Link>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/laundry" element={<LaundryPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
