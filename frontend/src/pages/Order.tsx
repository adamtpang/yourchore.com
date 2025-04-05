import { useState } from 'react'
import axios from 'axios'
import { CreditCardIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const Order = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        roomNumber: '',
        serviceType: 'Regular',
        notes: '',
        paymentMethod: ''
    })
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            await axios.post('http://localhost:5000/api/order', formData)
            setShowConfirmation(true)
        } catch (error) {
            console.error('Error submitting order:', error)
            alert('Failed to submit order. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (showConfirmation) {
        return (
            <div className="max-w-md mx-auto mt-12 text-center animate-enter">
                <div className="card">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
                    </div>
                    <h2 className="mt-6 text-2xl font-bold text-gray-900">Order Confirmed!</h2>
                    <p className="mt-2 text-gray-600">Your laundry will be picked up soon.</p>
                    <div className="mt-6 space-y-4">
                        <div className="rounded-lg bg-gray-50 px-4 py-3">
                            <div className="text-sm font-medium text-gray-500">Order Details</div>
                            <div className="mt-2">
                                <p className="text-sm text-gray-900">Room: {formData.roomNumber}</p>
                                <p className="text-sm text-gray-900">Service: {formData.serviceType}</p>
                                <p className="text-sm text-gray-900">Payment: {formData.paymentMethod}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => {
                                setShowConfirmation(false)
                                setFormData({
                                    customerName: '',
                                    roomNumber: '',
                                    serviceType: 'Regular',
                                    notes: '',
                                    paymentMethod: ''
                                })
                            }}
                            className="btn btn-primary w-full"
                        >
                            Place Another Order
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto animate-enter">
            <div className="card">
                <div className="px-4 py-6 sm:p-8">
                    <div className="mx-auto max-w-2xl">
                        <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
                        <p className="mt-2 text-gray-600">Fill in the details below to request laundry service.</p>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="input-group">
                                    <label htmlFor="customerName" className="input-label">Name</label>
                                    <input
                                        type="text"
                                        id="customerName"
                                        name="customerName"
                                        value={formData.customerName}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="Your name"
                                    />
                                </div>

                                <div className="input-group">
                                    <label htmlFor="roomNumber" className="input-label">Room Number</label>
                                    <input
                                        type="text"
                                        id="roomNumber"
                                        name="roomNumber"
                                        value={formData.roomNumber}
                                        onChange={handleChange}
                                        required
                                        className="input"
                                        placeholder="e.g. 101"
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label htmlFor="serviceType" className="input-label">Service Type</label>
                                <select
                                    id="serviceType"
                                    name="serviceType"
                                    value={formData.serviceType}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    <option value="Regular">Regular (24h) - $5.00</option>
                                    <option value="Express">Express (12h) - $8.00</option>
                                </select>
                            </div>

                            <div className="input-group">
                                <label htmlFor="notes" className="input-label">Special Instructions</label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    className="input"
                                    rows={3}
                                    placeholder="Any special care instructions?"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Payment Method</label>
                                <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Card' }))}
                                        className={`relative flex items-center justify-center rounded-lg border-2 p-4 transition-all duration-200 ${formData.paymentMethod === 'Card'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <CreditCardIcon className="h-6 w-6 mr-2" />
                                        <span className="font-medium">Credit Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'Crypto' }))}
                                        className={`relative flex items-center justify-center rounded-lg border-2 p-4 transition-all duration-200 ${formData.paymentMethod === 'Crypto'
                                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                    >
                                        <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                                        <span className="font-medium">Crypto</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                                disabled={!formData.paymentMethod || isSubmitting}
                            >
                                {isSubmitting ? 'Processing...' : 'Submit Order'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Order