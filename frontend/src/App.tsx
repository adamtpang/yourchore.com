import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LaundryPage from './pages/laundry';
import ConfirmationPage from './pages/confirmation';
import DashboardPage from './pages/dashboard';
import AdminDashboard from './pages/admin';
import './App.css'

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">YourChore</h1>
          <p className="text-xl text-gray-600 max-w-lg mx-auto">Campus services made simple</p>
        </div>

        <div className="mb-16">
          <Link
            to="/laundry"
            className="block overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative bg-indigo-600 h-40 flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-pattern"></div>
              <span className="relative text-6xl">🧺</span>
            </div>

            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Laundry Service</h2>
              <p className="text-gray-600 mb-4">Drop off your laundry and we'll handle the rest. Clean clothes with zero hassle.</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="inline-block bg-indigo-100 text-indigo-800 font-medium text-sm px-3 py-1 rounded-full">RM28/load</span>
                  <span className="ml-3 text-sm text-gray-500">14kg Mixed Load</span>
                </div>

                <span className="inline-flex items-center text-indigo-600 font-medium">
                  Order now
                  <svg className="ml-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center text-sm text-gray-500">
          &copy; 2024 YourChore • Making campus life easier
        </div>
      </div>
    </div>
  );
};

// Add the pattern for the background
const styles = `
.bg-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E");
}
`;

// Add the styles to the document
const StyleInject = () => {
  React.useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <StyleInject />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/laundry" element={<LaundryPage />} />
        <Route path="/confirmation" element={<ConfirmationPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
