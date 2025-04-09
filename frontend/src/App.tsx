import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { Header } from './components/Header'
import { ServiceCatalog } from './components/ServiceCatalog'
import { LaundryService } from './pages/LaundryService'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ServiceCatalog />} />
            <Route path="/services/laundry" element={<LaundryService />} />
            {/* Add more service routes here */}
            <Route path="*" element={
              <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
                <p className="text-gray-600 mb-8 text-center max-w-md">
                  The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  About YourChore
                </h3>
                <p className="text-gray-600 text-sm">
                  Making campus life easier with on-demand services for students and faculty.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Services
                </h3>
                <ul className="space-y-3">
                  <li>
                    <Link to="/services/laundry" className="text-gray-600 hover:text-gray-900 text-sm">
                      Laundry Service
                    </Link>
                  </li>
                  <li>
                    <span className="text-gray-400 text-sm flex items-center">
                      Food Delivery
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Soon
                      </span>
                    </span>
                  </li>
                  <li>
                    <span className="text-gray-400 text-sm flex items-center">
                      Room Cleaning
                      <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                        Soon
                      </span>
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                  Contact
                </h3>
                <ul className="space-y-3">
                  <li>
                    <a href="mailto:support@yourchore.com" className="text-gray-600 hover:text-gray-900 text-sm">
                      support@yourchore.com
                    </a>
                  </li>
                  <li>
                    <a href="tel:+1234567890" className="text-gray-600 hover:text-gray-900 text-sm">
                      (123) 456-7890
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} YourChore. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
