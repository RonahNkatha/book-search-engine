const typeDefs = `
   type User {
    _id: ID!
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Query {
    me: User
  }

  type Book {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

    input BookInput {
    bookId: String
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(book: BookInput): User
    removeBook(bookId: ID!): User
  }
`;

export default typeDefs;
