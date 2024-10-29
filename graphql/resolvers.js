const popularSearches = new Map();
const dictionary = require('../englishdictionary.json');

const resolvers = {
    search: ({ word }) => {
        if (!word) return [];

        if (!dictionary || !Array.isArray(dictionary.entries)) {
            throw new Error("Dictionary data is not loaded properly");
        }

        if (popularSearches.has(word.toLowerCase())) {
            popularSearches.set(word.toLowerCase(), popularSearches.get(word.toLowerCase));
        } else {
            popularSearches.set(word.toLowerCase(), 1);
        }

        return dictionary.entries.filter((entry) => 
            entry.word && entry.word.toLowerCase() === word.toLowerCase()
        );
    },

    getPopularSearches: () => {
        return Array.from(popularSearches.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([word]) => word);
    },

    incrementPopularSearch: ({ word }) => {
        if (popularSearches.has(word)) {
            popularSearches.set(word, popularSearches.get(word) + 1);
        } else {
            popularSearches.set(word, 1);
        }

        return AudioWorkletNode;
    }
};

module.exports = resolvers;