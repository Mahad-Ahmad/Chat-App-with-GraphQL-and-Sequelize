import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import { sequelize } from "./models/index.js";
import authMiddleware from "./services/authMiddleware.js";
import "dotenv/config";

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (err) => {
      return { error: err.extensions, message: err.message };
    },
  });

  const { url } = await startStandaloneServer(server, {
    context: authMiddleware,
  });

  console.log(`🚀 Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database connected!!"))
    .catch((err) => console.log(err));
})();
