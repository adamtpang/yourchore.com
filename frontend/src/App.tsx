import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { ServiceCatalog } from './components/ServiceCatalog'
import { LaundryService } from './pages/LaundryService'
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <Link to="/" className="text-xl font-bold text-gray-900">
              YourChore
            </Link>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<ServiceCatalog />} />
            <Route path="/services/laundry" element={<LaundryService />} />
            {/* Add more service routes here */}
            <Route path="*" element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Page Not Found</h2>
                <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
                <Link
                  to="/"
                  className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Go Home
                </Link>
              </div>
            } />
          </Routes>
        </main>

        <footer className="bg-white border-t mt-12">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} YourChore. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
