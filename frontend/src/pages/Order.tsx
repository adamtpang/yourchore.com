import { useState } from 'react'
import axios from 'axios'
import { CreditCardIcon, CurrencyDollarIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

interface OrderFormData {
    name: string;
    room: string;
    service: string;
    instructions: string;
    paymentMethod: 'stripe' | 'nowpayments' | 'rozo';
}

const FIXED_AMOUNT = 5; // $5 fixed amount

const Order = () => {
    const [formData, setFormData] = useState<OrderFormData>({
        name: '',
        room: '',
        service: 'wash-and-fold',
        instructions: '',
        paymentMethod: 'stripe'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [paymentMessage, setPaymentMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await axios.post('http://localhost:5000/api/orders', {
                ...formData,
                amount: FIXED_AMOUNT
            });

            if (response.data) {
                setShowConfirmation(true);

                // Set payment-specific messages
                switch (formData.paymentMethod) {
                    case 'stripe':
                        setPaymentMessage('Stripe Checkout would be triggered here.');
                        break;
                    case 'nowpayments':
                        setPaymentMessage('NOWPayments Invoice would be generated here.');
                        break;
                    default:
                        setPaymentMessage('');
                }
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Failed to submit order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showConfirmation) {
        return (
            <div className="max-w-lg mx-auto mt-12 p-6 bg-white rounded-xl shadow-soft">
                <div className="text-center">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500" />
                    <h2 className="mt-4 text-2xl font-semibold text-gray-900">Order Submitted!</h2>
                    <p className="mt-2 text-gray-600">Thank you for your order.</p>
                    {paymentMessage && (
                        <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700">
                            {paymentMessage}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-xl shadow-soft p-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Place an Order</h1>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                    <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                        Fixed price per order: ${FIXED_AMOUNT}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="input-group">
                        <label htmlFor="name" className="input-label">Name</label>
                        <input
                            type="text"
                            id="name"
                            className="input"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="room" className="input-label">Room Number</label>
                        <input
                            type="text"
                            id="room"
                            className="input"
                            value={formData.room}
                            onChange={(e) => setFormData(prev => ({ ...prev, room: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">Service Type</label>
                        <select
                            className="input"
                            value={formData.service}
                            onChange={(e) => setFormData(prev => ({ ...prev, service: e.target.value }))}
                            required
                        >
                            <option value="wash-and-fold">Wash & Fold</option>
                            <option value="dry-clean">Dry Clean</option>
                            <option value="iron-only">Iron Only</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Payment Method</label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'stripe' }))}
                                className={`relative flex items-center justify-center rounded-lg border-2 p-4 transition-all duration-200 ${formData.paymentMethod === 'stripe'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <CreditCardIcon className="h-6 w-6 mr-2" />
                                <span className="font-medium">Stripe</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'nowpayments' }))}
                                className={`relative flex items-center justify-center rounded-lg border-2 p-4 transition-all duration-200 ${formData.paymentMethod === 'nowpayments'
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-300 hover:border-gray-400'
                                    }`}
                            >
                                <CurrencyDollarIcon className="h-6 w-6 mr-2" />
                                <span className="font-medium">NOWPayments</span>
                            </button>

                            <button
                                type="button"
                                disabled
                                className="relative flex items-center justify-center rounded-lg border-2 border-gray-200 p-4 bg-gray-50 cursor-not-allowed"
                                title="Coming Soon – Powered by Rozo"
                            >
                                <CurrencyDollarIcon className="h-6 w-6 mr-2 text-gray-400" />
                                <span className="font-medium text-gray-400">Rozo</span>
                                <span className="absolute -top-2 -right-2 px-2 py-1 bg-gray-500 text-white text-xs rounded-full">Soon</span>
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="instructions" className="input-label">Special Instructions</label>
                        <textarea
                            id="instructions"
                            rows={3}
                            className="input"
                            value={formData.instructions}
                            onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-primary w-full"
                    >
                        {isSubmitting ? 'Submitting...' : 'Place Order'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Order;