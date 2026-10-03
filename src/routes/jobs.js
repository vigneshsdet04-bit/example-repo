'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const { userId, type, payload } = req.body;

        if (!type) {
            return res.status(400).json({
                error: 'type is required',
            });
        }

        const id = uuidv4();

        const result = await pool.query(
            `
      INSERT INTO jobs
      (
        id,
        user_id,
        type,
        status,
        payload
      )
      VALUES ($1, $2, $3, 'queued', $4)
      RETURNING *
      `,
            [
                id,
                userId || null,
                type,
                payload || null,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;