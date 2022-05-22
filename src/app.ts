import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
import path from "path";
import dotenv from "dotenv";

import { typeDefs, resolvers } from "./graphql";
import { connectDB } from "./helper/connectDB";

dotenv.config({ path: path.join(__dirname, "./.env") });

const app = express();
const port = 3000;

console.log(process.env.DB_URI);
connectDB();
const rootTypeDef = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

const server = new ApolloServer({
  typeDefs: [rootTypeDef, typeDefs],
  resolvers,
  context: (req) => ({ ...req }),
});

server.start().then(() => {
  server.applyMiddleware({ app, path: "/api/graphql" });
});

app.listen(port);

console.log(`[app] : http://localhost:${port}`);
