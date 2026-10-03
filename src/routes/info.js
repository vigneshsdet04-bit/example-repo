'use strict';

const express = require('express');
const os = require('os');
const config = require('../config');

const router = express.Router();

// GET /
router.get('/', (req, res) => {
    res.json({
        app: config.appName,
        version: config.appVersion,
        environment: config.nodeEnv,
        hostname: os.hostname(),
    });
});

module.exports = router;
