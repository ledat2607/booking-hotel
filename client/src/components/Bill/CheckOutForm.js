import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Button from 'react-bootstrap/Button';

function CheckoutForm({ amount, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) return;

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            console.error(error.message);
        } else {
            // Simulate API call to backend for payment processing
            const response = await fetch('http://localhost:5000/api/payment/confirm-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, paymentMethod }),
            });

            const result = await response.json();

            if (result.success) {
                onSuccess();
            } else {
                console.error('Payment failed:', result.message);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <Button type="submit" disabled={!stripe}>
                Xác nhận Thanh toán
            </Button>
        </form>
    );
}

export default CheckoutForm;
