'use strict';

const express = require('express');
const path = require('path');
const multer = require('multer');

const router = express.Router();

// Configure disk storage - files saved under uploads/
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
});

// POST /files/upload
router.post('/upload', upload.single('file'), (req, res, next) => {
    try {
        if (!req.file) {
            const err = new Error('No file uploaded. Use field name "file".');
            err.status = 400;
            return next(err);
        }

        return res.status(201).json({
            message: 'File uploaded successfully.',
            file: {
                originalName: req.file.originalname,
                filename: req.file.filename,
                size: req.file.size,
                mimetype: req.file.mimetype,
                // Path is local for now — will be replaced with S3 URL later
                path: req.file.path,
            },
        });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
