const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
    {
        room: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'rooms',
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'users',
        },
        customerList: [
            {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'customers',
            },
        ],
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        totalAmount: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Paid', 'Canceled'],
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

const Booking = mongoose.model('booking', bookingSchema);

module.exports = Booking;
