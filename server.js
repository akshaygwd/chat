const { ApolloServer, gql } = require('apollo-server');
const { sequelize  } =  require('./models');

// The GraphQL schema
const typeDefs = require('./graphql/typeDefs');

// A map of functions which return data for the schema.
const resolvers = require('./graphql/resolvers');
const contextMiddleware = require('./util/contextMiddleware');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
});

server.listen(4000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  sequelize.authenticate()
  .then(() => {
      console.log('connected');
  })
  .catch((error) => {
      console.log(error);
  })
});