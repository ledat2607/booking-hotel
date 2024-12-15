const express = require('express');
const router = express.Router();
const { getReports, createReportsModal, getReportByMonth } = require('../controllers/ReportController.js');

router.get('/all', getReports);

router.get('/all/:month/:year', getReportByMonth);

router.get('/create/:month/:year', createReportsModal);

module.exports = router;
