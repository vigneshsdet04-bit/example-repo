'use strict';

const express = require('express');
const os = require('os');
const config = require('../config');

const router = express.Router();

// GET /health
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        hostname: os.hostname(),
    });
});

module.exports = router;
