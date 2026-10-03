'use strict';

require('dotenv').config();

const app = require('./app');
const config = require('./config');

const server = app.listen(config.port, () => {
    console.log(`╔══════════════════════════════════════════╗`);
    console.log(`║  ${config.appName} v${config.appVersion}`);
    console.log(`║  Environment : ${config.nodeEnv}`);
    console.log(`║  Port        : ${config.port}`);
    console.log(`╚══════════════════════════════════════════╝`);
});

// ─── Graceful Shutdown ───────────────────────────────────────────────────────
const shutdown = (signal) => {
    console.log(`\n[${signal}] Received. Closing server gracefully...`);
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });

    // Force exit after 10 s if still hanging
    setTimeout(() => {
        console.error('Could not close connections in time. Forcing exit.');
        process.exit(1);
    }, 10_000);
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason);
});

process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err);
    process.exit(1);
});
