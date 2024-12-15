const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    booking: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'booking',
    },
    user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users',
    },
    dateOfPayment: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
});

const Bill = mongoose.model('bill', billSchema);

module.exports = Bill;
