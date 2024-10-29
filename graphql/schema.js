const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        search(word: String!): [Definition]
        getPopularSearches: [String]
    }

    type Definition {
        word: String
        wordtype: String
        definition: String
    }

    type Mutation {
        incrementPopularSearch(word: String!): String
    }
`)

module.exports = schema;