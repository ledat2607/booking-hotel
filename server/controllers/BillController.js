const Bill = require('../models/Bill.js');
const Booking = require('../models/Booking.js');

const getBills = async (req, res) => {
    try {
        const bills = await Bill.find()
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');

        res.status(200).json({
            success: true,
            message: 'Get all bills successfully',
            bills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};

const getBillById = async (req, res) => {
    try {
        const { id } = req.params;
        const bill = await Bill.findById(id)
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Get bill successfully',
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};

const getBillsByUserId = async (req, res) => {
    const { id } = req.params;

    try {
        const bills = await Bill.find({ user: id })
            .populate({ path: 'booking', populate: { path: 'customerList' } })
            .populate({ path: 'booking', populate: { path: 'room' } })
            .populate('user');

        if (bills.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not have any bill',
            });
        }
        res.status(200).json({
            success: true,
            message: 'Get bills successfully',
            bills,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server internal error',
            error,
        });
    }
};

const createBill = async (req, res) => {
    try {
        const { bookingId, userId, dateOfPayment, totalAmount, address } = req.body;
        console.log(`check body`, req.body);
        const bill = await Bill.create({
            booking: bookingId,
            user: userId,
            dateOfPayment,
            totalAmount,
            address,
        });
        if (!bill) {
            return res.status(400).json({
                success: false,
                message: 'Create bill failed',
            });
        }
        res.status(201).json({
            success: true,
            message: 'Create bill successfully',
            bill,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error,
        });
    }
};

module.exports = { getBills, getBillById, createBill, getBillsByUserId };
