const express = require('express');

const router = express.Router();
const { upload } = require('../helpers/fileHelper');

const {
    getAllRoomType,
    getRoomTypeById,
    createRoomType,
    updateRoomType,
    deleteRoomType,
} = require('../controllers/RoomTypesController.js');

router.get('/all', getAllRoomType);

router.get('/:id', getRoomTypeById);

router.post('/create', upload.array('images'), createRoomType);

router.put('/update/:id', upload.array('images'), updateRoomType);

router.delete('/delete/:id', deleteRoomType);

module.exports = router;
