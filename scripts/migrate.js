'use strict';

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false,
    },
});

async function migrate() {
    const migrationsDir = path.join(__dirname, '..', 'migrations');

    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith('.sql'))
        .sort();

    await client.connect();

    // Create migration tracking table first
    await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

    for (const file of files) {
        const result = await client.query(
            'SELECT 1 FROM schema_migrations WHERE filename = $1',
            [file]
        );

        if (result.rowCount > 0) {
            console.log(`Skipping ${file} - already applied`);
            continue;
        }

        console.log(`Applying ${file}...`);

        const sql = fs.readFileSync(
            path.join(migrationsDir, file),
            'utf8'
        );

        await client.query('BEGIN');

        try {
            await client.query(sql);

            await client.query(
                'INSERT INTO schema_migrations (filename) VALUES ($1)',
                [file]
            );

            await client.query('COMMIT');

            console.log(`Applied ${file}`);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        }
    }

    console.log('Database migration completed successfully.');
}

migrate()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error('Migration failed:', error);
        process.exit(1);
    });