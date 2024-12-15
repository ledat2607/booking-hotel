const express = require('express');
const router = express.Router();
const stripe = require('stripe')(
    'sk_test_51QUk8vDbPGKIc4yqmKgXaBOjKcDHnrITpDUh2HvD6YacDCdulMf3XUebOh0ziAreKU2DUCbJZtOsja1esQ4APsQY00Bf5ZDroF',
);

router.post('/confirm-payment', async (req, res) => {
    try {
        const { amount, paymentMethod } = req.body;

        // Create a PaymentIntent with the received amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd', // Set to your desired currency
            payment_method: paymentMethod.id,
            confirm: true,
            return_url: 'http://localhost:3000/user/my-booking',
        });

        // Respond with success or error
        if (paymentIntent.status === 'succeeded') {
            return res.json({ success: true });
        } else {
            return res.status(500).json({ success: false, message: 'Payment failed' });
        }
    } catch (error) {
        console.error('Payment processing error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
