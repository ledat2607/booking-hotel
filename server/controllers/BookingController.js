const Booking = require('../models/Booking');
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');
const Room = require('../models/Room');

//@desc Get all bookings of a user
//@route GET /api/bookings/user/:id
//@access Private

const createBooking = async (req, res) => {
    const { roomId, checkInDate, checkOutDate, customerList, totalAmount } = req.body;
    if (!roomId || !checkInDate || !checkOutDate || !customerList || !totalAmount) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }
    try {
        let customerListId = [];
        for (let i = 0; i < customerList.length; i++) {
            const newCustomer = new Customer({
                name: customerList[i].name,
                typeUser: customerList[i].typeUser,
                CMND: customerList[i].CMND,
                address: customerList[i].address,
            });
            await newCustomer.save();
            customerListId.push(newCustomer._id.toString());
        }

        const NewBooking = await Booking.create({
            room: roomId,
            user: req.userId,
            customerList: customerListId,
            checkInDate,
            checkOutDate,
            totalAmount,
        });
        if (NewBooking) {
            return res.status(201).json({
                success: true,
                message: 'Booking created successfully',
                NewBooking,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Booking not created',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

const createBookingWithBill = async (req, res) => {
    const { roomId, checkInDate, checkOutDate, customerList, totalAmount, dateOfPayment, address } = req.body;
    console.log(`check body`, req.body);

    if (!roomId || !checkInDate || !checkOutDate || !customerList || !totalAmount || !dateOfPayment) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }

    try {
        const newCheckInDate = new Date(checkInDate);
        const newCheckOutDate = new Date(checkOutDate);

        const ListBooking = await Booking.find({ room: roomId });

        // Check if room is available
        const IsAvailable = () => {
            for (let booking of ListBooking) {
                const existingCheckIn = new Date(booking.checkInDate);
                const existingCheckOut = new Date(booking.checkOutDate);

                if (
                    (newCheckInDate >= existingCheckIn && newCheckInDate < existingCheckOut) ||
                    (newCheckOutDate > existingCheckIn && newCheckOutDate <= existingCheckOut) ||
                    (newCheckInDate <= existingCheckIn && newCheckOutDate >= existingCheckOut)
                ) {
                    return false;
                }
            }
            return true;
        };

        if (!IsAvailable()) {
            return res.status(400).json({
                success: false,
                message: 'Room is not available for this time',
            });
        }

        // Create customer list
        let customerListId = [];
        for (let i = 0; i < customerList.length; i++) {
            const newCustomer = new Customer({
                name: customerList[i].name,
                typeUser: customerList[i].typeUser,
                CMND: customerList[i].CMND,
                address: customerList[i].address,
            });
            await newCustomer.save();
            customerListId.push(newCustomer._id.toString());
        }

        // Create booking
        const NewBooking = await Booking.create({
            room: roomId,
            user: req.userId,
            customerList: customerListId,
            checkInDate,
            checkOutDate,
            totalAmount,
        });

        const BookingRoom = await Room.findById({ _id: roomId });
        BookingRoom.currentBookings.push(NewBooking._id);
        await BookingRoom.save();

        if (NewBooking) {
            // Create bill
            const newBill = await Bill.create({
                booking: NewBooking._id,
                user: req.userId,
                dateOfPayment,
                address,
                totalAmount,
            });

            if (newBill) {
                return res.status(201).json({
                    success: true,
                    message: 'Booking created successfully',
                    NewBooking,
                    newBill,
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: 'Bill not created',
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: 'Booking not created',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message,
        });
    }
};

// @desc    Get all bookings of a user
// @route   GET /api/booking/all
// @access  Private

const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('room', ['roomNumber'])
            .populate('user', ['Name', 'isAdmin'])
            .populate('customerList');
        return res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            length: bookings.length,
            bookings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

//@desc Get booking by id
//@route GET /api/bookings/:id
//@access Private

const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('room', ['roomNumber'])
            .populate('user', ['Name', 'isAdmin'])
            .populate('customerList');
        if (booking) {
            return res.status(200).json({
                success: true,
                message: 'Booking fetched successfully',
                booking,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

// @desc    Get all bookings of a user
// @route   GET /api/booking/user/:id
// @access  Private

const getBookingsByUserId = async (req, res) => {
    const { id } = req.params;
    try {
        const Bookings = await Booking.find({ user: id })
            .populate('room', ['roomNumber'])
            .populate('user', ['Name', 'isAdmin'])
            .populate('customerList');
        if (Bookings.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'User has no booking',
                Bookings: [],
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Bookings fetched successfully',
            length: Bookings.length,
            Bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server internal error',
            error,
        });
    }
};

//@desc Update booking info
//@route PUT /api/bookings/update/:id
//@access Private

const updateBooking = async (req, res) => {
    const { roomId, checkInDate, checkOutDate, customerList, totalAmount } = req.body;
    if (!roomId || !checkInDate || !checkOutDate || !customerList || !totalAmount) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }
    try {
        let customerListId = [];
        for (let i = 0; i < customerList.length; i++) {
            const newCustomer = new Customer({
                name: customerList[i].name,
                typeUser: customerList[i].typeUser,
                CMND: customerList[i].CMND,
                address: customerList[i].address,
            });
            await newCustomer.save();
            customerListId.push(newCustomer._id.toString());
        }

        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.room = roomId;
            booking.customerList = customerListId;
            booking.checkInDate = checkInDate;
            booking.checkOutDate = checkOutDate;
            booking.totalAmount = totalAmount;
        }

        const updatedBooking = await booking.save();

        if (updatedBooking.room !== roomId) {
            const BookingRoom = await Room.findIndex({ _id: updatedBooking.room });
            BookingRoom.currentBookings = BookingRoom.currentBookings.filter(
                (booking) => booking._id.toString() !== updatedBooking._id.toString(),
            );
            await BookingRoom.save();
        }

        await BookingRoom.save();
        if (updatedBooking) {
            return res.status(200).json({
                success: true,
                message: 'Booking updated successfully',
                updatedBooking,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Booking not updated',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
        });
    }
};

//@desc delete booking by id
//@route DELETE /api/bookings/delete/:id
//@access Private

const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            const BookingRoom = await Room.findById(booking.room);
            BookingRoom.currentBookings = BookingRoom.currentBookings.filter(
                (booking) => booking._id.toString() !== req.params.id.toString(),
            );
            await BookingRoom.save();

            await booking.remove();

            return res.status(200).json({
                success: true,
                message: 'Booking deleted successfully',
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};

//@desc set status of booking by admin
//@route PUT /api/bookings/status/:id
//@access Private

const setSatatusBooking = async (req, res) => {
    const { status } = req.body;
    if (!status) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
        });
    }
    try {
        const booking = await Booking.findById(req.params.id);
        if (booking) {
            booking.status = status;
        }
        const updatedBooking = await booking.save();
        if (updatedBooking) {
            return res.status(200).json({
                success: true,
                message: 'Booking updated successfully',
                updatedBooking,
            });
        } else {
            return res.status(400).json({
                success: false,
                message: 'Booking not updated',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
const updateBillStatus = async (req, res) => {
    const { bookingId } = req.body;
    if (!bookingId) {
        return res.status(400).json({ success: false, message: 'Bill ID is required' });
    }

    try {
        const bill = await Bill.findOne({ booking: bookingId });
        const booking = await Booking.findById(bookingId);
        if (!bill) {
            return res.status(404).json({ success: false, message: 'Bill not found' });
        }
        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }
        bill.dateOfPayment = new Date();
        booking.status = 'Paid';
        await bill.save();
        await booking.save();

        res.status(200).json({ success: true, message: 'Bill status updated to Payed', bill });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
module.exports = {
    createBooking,
    getBookings,
    getBookingById,
    getBookingsByUserId,
    updateBooking,
    deleteBooking,
    setSatatusBooking,
    createBookingWithBill,
    updateBillStatus,
};
