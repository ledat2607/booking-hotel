const express = require('express');
const router = express.Router();
const {
    getFavoriteRoomsByUserId,
    addFavoriteRoom,
    removeFavoriteRoom,
    checkFavoriteRoomsByRoomId,
} = require('../controllers/FavoriteController.js');
const verifyToken = require('../middleware/auth.js');

router.get('/', verifyToken, getFavoriteRoomsByUserId);

router.get('/add/:roomId', verifyToken, addFavoriteRoom);

router.delete('/remove/:roomId', verifyToken, removeFavoriteRoom);

router.get('/check/:roomId', verifyToken, checkFavoriteRoomsByRoomId);

module.exports = router;
