'use strict';

const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

const router = express.Router();

const upload = multer({
    dest: 'uploads/',
});

router.post('/upload', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                error: 'file is required',
            });
        }

        const id = uuidv4();

        const result = await pool.query(
            `
      INSERT INTO files
      (
        id,
        user_id,
        filename,
        storage_key,
        content_type,
        size_bytes
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
            [
                id,
                req.body.userId || null,
                req.file.originalname,
                req.file.filename,
                req.file.mimetype,
                req.file.size,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
});

module.exports = router;