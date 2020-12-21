const { ApolloServer, gql } = require('apollo-server');

module.exports = gql`
type User {
  username: String!
  email: String
  imageUrl: String
  createdAt: String
  token: String
  latestMessage: Message
}

type Message {
  uuid: String!
  content: String!
  from: String!
  to: String!
  createdAt: String!
}

type Query {
  "A simple type for getting started!"
  hellome: String
  getUsers: [User]!
  login(
    username: String!
    password: String!
  ): User!
  getMessage(from:String!): [Message]!
}


type Mutation {
  register(
    username: String!
    email: String!
    password: String!
    confirmPassword: String!
  ): User!
  sendMessage(to:String! content: String!): Message!
}

type Subscription {
  newMessage: Message!
}
`;