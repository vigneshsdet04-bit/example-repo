'use strict';

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const store = require('../store');

const router = express.Router();

// POST /chats
router.post('/', (req, res, next) => {
    try {
        const { userId, title } = req.body;

        if (!userId || !title) {
            const err = new Error('Fields "userId" and "title" are required.');
            err.status = 400;
            return next(err);
        }

        const userExists = store.users.find((u) => u.id === userId);
        if (!userExists) {
            const err = new Error(`User with id "${userId}" not found.`);
            err.status = 404;
            return next(err);
        }

        const chat = {
            id: uuidv4(),
            userId,
            title: title.trim(),
            createdAt: new Date().toISOString(),
        };

        store.chats.push(chat);
        return res.status(201).json(chat);
    } catch (err) {
        return next(err);
    }
});

// GET /chats/:userId
router.get('/:userId', (req, res, next) => {
    try {
        const { userId } = req.params;
        const userExists = store.users.find((u) => u.id === userId);
        if (!userExists) {
            const err = new Error(`User with id "${userId}" not found.`);
            err.status = 404;
            return next(err);
        }

        const chats = store.chats.filter((c) => c.userId === userId);
        return res.json({ count: chats.length, chats });
    } catch (err) {
        return next(err);
    }
});

// POST /chats/:chatId/messages
router.post('/:chatId/messages', (req, res, next) => {
    try {
        const { chatId } = req.params;
        const { message } = req.body;

        if (!message) {
            const err = new Error('Field "message" is required.');
            err.status = 400;
            return next(err);
        }

        const chat = store.chats.find((c) => c.id === chatId);
        if (!chat) {
            const err = new Error(`Chat with id "${chatId}" not found.`);
            err.status = 404;
            return next(err);
        }

        const msg = {
            id: uuidv4(),
            chatId,
            message: message.trim(),
            createdAt: new Date().toISOString(),
        };

        store.messages.push(msg);
        return res.status(201).json(msg);
    } catch (err) {
        return next(err);
    }
});

// GET /chats/:chatId/messages
router.get('/:chatId/messages', (req, res, next) => {
    try {
        const { chatId } = req.params;
        const chat = store.chats.find((c) => c.id === chatId);
        if (!chat) {
            const err = new Error(`Chat with id "${chatId}" not found.`);
            err.status = 404;
            return next(err);
        }

        const messages = store.messages.filter((m) => m.chatId === chatId);
        return res.json({ count: messages.length, messages });
    } catch (err) {
        return next(err);
    }
});

module.exports = router;
