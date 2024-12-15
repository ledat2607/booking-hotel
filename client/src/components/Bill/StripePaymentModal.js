import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import Modal from 'react-bootstrap/Modal';
import CheckoutForm from './CheckOutForm';

const stripePromise = loadStripe(
    'pk_test_51QUk8vDbPGKIc4yqkt52XYC7alelniKHIAIXtfPnbHN35n2W0p8cqQ3pNvDmGEDvdv973Cubdnr3C7x9Kg5eqcYA001xiLCs9B',
);

function StripePaymentModal({ show, onClose, onSuccess, amount }) {
    if (!show) return null;

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thanh toán bằng Stripe</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Elements stripe={stripePromise}>
                    <CheckoutForm amount={amount} onSuccess={onSuccess} />
                </Elements>
            </Modal.Body>
        </Modal>
    );
}

export default StripePaymentModal;
