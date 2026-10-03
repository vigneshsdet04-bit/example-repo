'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = express.Router();

// POST /jobs
router.post('/', (req, res, next) => {
    try {
        const payload = req.body;

        if (!payload || Object.keys(payload).length === 0) {
            const err = new Error('Request body must contain a job payload.');
            err.status = 400;
            return next(err);
        }

        const job = {
            id: uuidv4(),
            status: 'queued',
            payload,
            // Will be sent to RabbitMQ queue later
            createdAt: new Date().toISOString(),
        };

        store.jobs.push(job);
        return res.status(201).json(job);
    } catch (err) {
        return next(err);
    }
});

// GET /jobs — optional: list all jobs for inspection
router.get('/', (req, res) => {
    res.json({ count: store.jobs.length, jobs: store.jobs });
});

module.exports = router;
