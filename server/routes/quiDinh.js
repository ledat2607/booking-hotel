const express = require('express');
const router = express.Router();
const { getQuiDinh, updateQuiDinh } = require('../controllers/QuiDinhController.js');

router.get('/get', getQuiDinh);

router.put('/update', updateQuiDinh);

module.exports = router;
