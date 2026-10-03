'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const router = express.Router();

// Create chat
router.post('/', async (req, res, next) => {
    try {
        const { userId, title } = req.body;

        if (!userId) {
            return res.status(400).json({
                error: 'userId is required',
            });
        }

        const id = uuidv4();

        const result = await pool.query(
            `
      INSERT INTO chats (id, user_id, title)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
            [id, userId, title || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Get chats for user
router.get('/:userId', async (req, res, next) => {
    try {
        const result = await pool.query(
            `
      SELECT *
      FROM chats
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
            [req.params.userId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

// Add message
router.post('/:chatId/messages', async (req, res, next) => {
    try {
        const { role, content } = req.body;

        if (!role || !content) {
            return res.status(400).json({
                error: 'role and content are required',
            });
        }

        const id = uuidv4();

        const result = await pool.query(
            `
      INSERT INTO messages (id, chat_id, role, content)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
            [id, req.params.chatId, role, content]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

// Get messages
router.get('/:chatId/messages', async (req, res, next) => {
    try {
        const result = await pool.query(
            `
      SELECT *
      FROM messages
      WHERE chat_id = $1
      ORDER BY created_at ASC
      `,
            [req.params.chatId]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
});

module.exports = router;