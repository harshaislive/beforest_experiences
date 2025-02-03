'use client';

import { useState } from 'react';

export default function PaymentTest() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTestPayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Create a test registration
            const registrationResponse = await fetch('/api/test/create-registration', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: 1, // ₹1
                    email: 'test@example.com',
                    name: 'Test User'
                }),
            });

            if (!registrationResponse.ok) {
                const errorData = await registrationResponse.json();
                throw new Error(errorData.error || 'Failed to create test registration');
            }

            const registrationData = await registrationResponse.json();

            if (!registrationData.paymentUrl) {
                throw new Error('Payment URL not received from server');
            }

            // Store transaction ID in session storage for recovery
            if (registrationData.transactionId) {
                sessionStorage.setItem('lastTransactionId', registrationData.transactionId);
            }

            // Redirect to payment gateway
            window.location.href = registrationData.paymentUrl;

        } catch (error) {
            console.error('Test payment error:', error);
            setError(error instanceof Error ? error.message : 'Something went wrong with the payment process');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-beige py-8 sm:py-12 px-4">
            <div className="max-w-xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-deep-brown mb-4 sm:mb-6">
                        Payment Test Page
                    </h1>

                    <div className="space-y-4">
                        <div className="bg-sage-50 p-4 rounded-lg">
                            <h2 className="font-medium text-deep-brown mb-2">
                                Test Details
                            </h2>
                            <div className="space-y-1.5 text-deep-brown/70 text-sm sm:text-base">
                                <p>Amount: ₹1</p>
                                <p>Email: test@example.com</p>
                                <p>Name: Test User</p>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                                <button 
                                    onClick={() => setError(null)}
                                    className="text-red-600 text-sm mt-2 hover:text-red-700"
                                >
                                    Dismiss
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleTestPayment}
                            disabled={loading}
                            className="w-full py-3 px-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed active:bg-terracotta/80 transition-colors touch-manipulation text-base sm:text-lg font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Test ₹1 Payment'
                            )}
                        </button>

                        <p className="text-sm text-deep-brown/60 text-center px-4">
                            This is a test page for verifying payment integration.
                            The amount charged will be ₹1.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
} 