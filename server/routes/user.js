const express = require('express');
const router = express.Router();
const {
    changeInfo,
    changeInfoAll,
    changePassword,
    getUsers,
    getUsersWithPagination,
    addUser,
    getUserById,
    deleteUser,
} = require('../controllers/UserController.js');

router.put('/:id/change-info', changeInfo);

// change info of user by user
router.put('/:id/change-info-all', changeInfoAll);

router.put('/:id/change-password', changePassword);

router.delete('/:id/delete', deleteUser);

router.get('/all', getUsers);

router.get('/:page/:limit', getUsersWithPagination);

router.get('/:id', getUserById);

router.post('/add', addUser);

module.exports = router;
