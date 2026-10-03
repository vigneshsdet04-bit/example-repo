'use strict';

/**
 * In-memory data store.
 * These will be replaced by real databases (PostgreSQL, Redis, etc.) later.
 */
const store = {
    users: [],
    chats: [],
    messages: [],
    jobs: [],
};

module.exports = store;
