'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const router = express.Router();

// Create user
router.post('/', async (req, res, next) => {
    try {
        const { email, name } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'email is required',
            });
        }

        const id = uuidv4();

        const result = await pool.query(
            `
      INSERT INTO users (id, email, name)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [id, email, name || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({
                error: 'User with this email already exists',
            });
        }

        next(error);
    }
});

// Get all users
router.get('/', async (req, res, next) => {
    try {
        const result = await pool.query(
            `
      SELECT *
      FROM users
      ORDER BY created_at DESC
      `
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

module.exports = router;