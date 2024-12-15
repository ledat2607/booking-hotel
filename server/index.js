const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const connectDB = require('./config/connectDB.js');
const path = require('path');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes.js');

// Import các route
const rooms = require('./routes/rooms.js');
const auth = require('./routes/auth.js');
const roomTypes = require('./routes/roomTypes.js');
const booking = require('./routes/booking.js');
const user = require('./routes/user.js');
const uploads = require('./routes/upload.js');
const quiDinh = require('./routes/quiDinh.js');
const bill = require('./routes/bill.js');
const report = require('./routes/report.js');
const favoriteRooms = require('./routes/favoriteRooms.js');

// Kết nối đến cơ sở dữ liệu
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000/', // Change this to your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent with the request
};

// Use CORS middleware
app.use(cors(corsOptions));

// Thêm headers trước khi định nghĩa các route
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', `${process.env.CLIENT_URL}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware cho các route
app.use(morgan('dev'));

// Định nghĩa các route
app.use('/api/booking', booking);
app.use('/api/auth', auth);
app.use('/api/rooms', rooms);
app.use('/api/room-type', roomTypes);
app.use('/api/user', user);
app.use('/api/upload', uploads);
app.use('/api/quidinh', quiDinh);
app.use('/api/bill', bill);
app.use('/api/report', report);
app.use('/api/favorite-rooms', favoriteRooms);
app.use('/api/payment/', paymentRoutes);

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
