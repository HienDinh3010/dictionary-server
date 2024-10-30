const popularSearches = new Map();
const dictionary = require('../englishdictionary.json');
const connectDB = require('../database/db');

const resolvers = {
    search: ({ word }) => {
        if (!word) return [];

        if (!dictionary || !Array.isArray(dictionary.entries)) {
            throw new Error("Dictionary data is not loaded properly");
        }

        return dictionary.entries.filter((entry) => 
            entry.word && entry.word.toLowerCase() === word.toLowerCase()
        );
    },

    getPopularSearches: async () => {
        const collection = await connectDB();

        // Query to find top 10 terms by count
        const popularTerms = await collection
            .find({})
            .sort({ count: -1 })  // Sort by count in descending order
            .limit(10)             // Limit to top 10 results
            .toArray();            // Convert result to array

        // Map the results to return only the terms
        return popularTerms.map(doc => doc.term);
    },
};

module.exports = resolvers;