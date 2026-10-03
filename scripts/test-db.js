const pool = require('../src/config/db');

async function test() {
    try {
        const result = await pool.query('SELECT NOW() AS current_time');
        console.log('PostgreSQL connection successful');
        console.log(result.rows[0]);
    } catch (error) {
        console.error('PostgreSQL connection failed:', error.message);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

test();