const { Client } = require("pg");

let client: any;

try {
    if (!process.env.DATABASE_URL) {
        console.error('Error: DATABASE_URL is not defined in the environment variables.');
        throw new Error('DATABASE_URL is required but not set.');
    }

    const connectionString = process.env.DATABASE_URL;

    // Initialize the pg client
    client = new Client({
        connectionString,
        ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    });

    client.connect((err: Error) => {
        if (err) {
            console.error('Failed to connect to the database:', err.message);
            throw err;
        }
        console.log('Database connection established successfully.');
    });
} catch (error) {
    console.error('Failed to connect to the database:', error);
    throw error;
}
export default client;

