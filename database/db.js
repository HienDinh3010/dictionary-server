const { MongoClient } = require('mongodb');

// This line should now load MONGO_URI correctly
const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("MONGO_URI is not defined. Please check your environment variables.");
}

const client = new MongoClient(uri);

let db;

async function connectDB() {
    if (!db) {
        await client.connect();
        db = client.db('dictionaryDB').collection('searchHistory');
    }
    return db;
}

module.exports = connectDB;
