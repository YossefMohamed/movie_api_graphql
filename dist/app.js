"use strict";
/* eslint-disable */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const graphql_1 = require("./graphql");
const connectDB_1 = require("./helper/connectDB");
dotenv_1.default.config({ path: path_1.default.join(__dirname, "./.env") });
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
console.log(process.env.DB_URI);
(0, connectDB_1.connectDB)();
const rootTypeDef = (0, apollo_server_express_1.gql) `
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;
app.get("/", (req, res) => {
    res.send("App Is Working");
});
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: [rootTypeDef, ...graphql_1.typeDefs],
    resolvers: graphql_1.resolvers,
    context: (req) => (Object.assign({}, req)),
});
server.start().then(() => {
    server.applyMiddleware({ app, path: "/api/graphql" });
});
app.listen(port);
console.log(`[app] : http://localhost:${port}`);
//# sourceMappingURL=app.js.map