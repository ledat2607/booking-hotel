const express = require('express');
const router = express.Router();
const { getBills, getBillById, createBill, getBillsByUserId } = require('../controllers/BillController.js');

router.get('/all', getBills);

router.get('/:id', getBillById);

router.get('/user/:id', getBillsByUserId);

router.post('/create', createBill);

module.exports = router;
