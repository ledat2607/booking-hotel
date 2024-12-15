const express = require('express');

const router = express.Router();
const { upload } = require('../helpers/fileHelper');

const {
    getAllRooms,
    getAllRoomsWithPagination,
    getRoomsFilter,
    getAllRoomsByType,
    getAllRoomsByTypeName,
    getRoomById,
    createRoom,
    updateRoomWithBookingDetails,
    deleteRoom,
} = require('../controllers/RoomsController.js');

router.get('/all', getAllRooms);

router.get('/all/:page', getAllRoomsWithPagination);

router.post('/filter/:page', getRoomsFilter);

router.get('/all/type/:id', getAllRoomsByType);

router.get('/all/type/name/:name', getAllRoomsByTypeName);

router.get('/:id', getRoomById);

router.post('/createRoom', upload.array('images'), createRoom);

router.put('/updateRoom/:id', upload.array('images'), updateRoomWithBookingDetails);

router.delete('/deleteRoom/:id', deleteRoom);

module.exports = router;
