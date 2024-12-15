const express = require('express');
const router = express.Router();

const {
    createBooking,
    getBookings,
    getBookingById,
    getBookingsByUserId,
    deleteBooking,
    updateBooking,
    setSatatusBooking,
    createBookingWithBill,
    updateBillStatus,
} = require('../controllers/BookingController.js');
const verifyToken = require('../middleware/auth.js');

router.post('/create', verifyToken, createBooking);

router.post('/create/bill', verifyToken, createBookingWithBill);

router.get('/all', getBookings);

router.get('/:id', verifyToken, getBookingById);

router.get('/user/:id', verifyToken, getBookingsByUserId);

router.put('/update/:id', verifyToken, updateBooking);

router.put('/update-bill-status', updateBillStatus);

router.delete('/delete/:id', verifyToken, deleteBooking);

router.put('/admin/status/:id', setSatatusBooking);

module.exports = router;
