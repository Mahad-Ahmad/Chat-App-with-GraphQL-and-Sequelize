// External Imports
import { ApolloServer } from "@apollo/server";
import { createServer } from "http";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";


// Internal Imports
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";
import bodyParser from "body-parser";
import { sequelize } from "./models/index.js";
import authMiddleware from "./services/authMiddleware.js";
import cors from "cors";
import "dotenv/config";
import express from "express";

const PORT = 4000;

(async () => {
  // Authenticate database connection
  await sequelize.authenticate();
  console.log("Database connected!!");

  const schema = makeExecutableSchema({
    introspection: true,
    typeDefs,
    resolvers,
    csrfPrevention: true,
    formatError: (err) => {
      return { error: err.extensions, message: err.message };
    },
  });

  const app = express();
  const httpServer = createServer(app);

  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  // Hand in the schema we just created and have the WebSocketServer start listening.
  const serverCleanup = useServer(
    { schema, context: authMiddleware },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();
  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, { context: authMiddleware })
  );

  // Now that our HTTP server is fully set up, we can listen to it.
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(
      `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
    );
  });
})();
