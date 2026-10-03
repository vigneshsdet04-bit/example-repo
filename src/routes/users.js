'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = express.Router();

// POST /users
router.post('/', (req, res, next) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            const err = new Error('Fields "name" and "email" are required.');
            err.status = 400;
            return next(err);
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            const err = new Error('Invalid email format.');
            err.status = 400;
            return next(err);
        }

        const duplicate = store.users.find((u) => u.email === email);
        if (duplicate) {
            const err = new Error('A user with this email already exists.');
            err.status = 409;
            return next(err);
        }

        const user = {
            id: uuidv4(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            createdAt: new Date().toISOString(),
        };

        store.users.push(user);
        return res.status(201).json(user);
    } catch (err) {
        return next(err);
    }
});

// GET /users
router.get('/', (req, res) => {
    res.json({
        count: store.users.length,
        users: store.users,
    });
});

module.exports = router;
