import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./graphql/typedefs.js";
import { resolvers } from "./graphql/resolvers.js";
import { sequelize } from "./models/index.js";
import "dotenv/config";

(async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    context: (ctx) => ctx,
  });

  console.log(`🚀 Server ready at ${url}`);
  sequelize
    .authenticate()
    .then(() => console.log("Database connected!!"))
    .catch((err) => console.log(err));
})();
