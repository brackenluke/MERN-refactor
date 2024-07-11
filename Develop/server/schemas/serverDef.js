const { gql } = require('apollo-server-express');

const serverDef = gql`
    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }
    type Auth {
        token: ID!
        user: User
    }
    type Book {
        bookId: ID!
        authors: [String]
        description: String
        title: String
        image: String
        link: String
    }
    input addBook {
        bookId: String
        authors: [String]
        title: String
        description: String
        image: String
        link: String
    }
    type Query {
        me: User
    }
    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveBook(newBook: InputBook!): User
        deleteBook(bookId: ID!): User
    }
`;

module.exports = serverDef;