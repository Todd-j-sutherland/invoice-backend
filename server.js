const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ApolloServer, gql } = require("apollo-server-express");
const Invoice = require("./invoice");

const dotenv = require("dotenv");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// GraphQL schema definitions
const typeDefs = gql`
  type Query {
    hello: String
    invoices(completed: Boolean): [Invoice]
    invoice(id: ID!): Invoice
  }
  type Invoice {
    id: ID
    clientName: String
    debt: Float
    dateTime: String
    dueDate: String
    completed: Boolean
  }
  type Mutation {
    addInvoice(clientName: String!, debt: Float!, dueDate: String!): Invoice
  }
`;

// Resolvers define how to fulfill the GraphQL queries
const resolvers = {
  Query: {
    invoices: async (_, { completed }) => {
      try {
        if (completed !== undefined) {
          return await Invoice.find({ completed });
        }
        return await Invoice.find({});
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch invoices");
      }
    },
    invoice: async (_, { id }) => {
      try {
        return await Invoice.findById(id);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch invoice");
      }
    },
  },
  Mutation: {
    addInvoice: async (_, { clientName, debt, dueDate }) => {
      try {
        console.log("trying");
        const newInvoice = new Invoice({
          clientName,
          debt,
          dueDate,
        });
        await newInvoice.save();
        return newInvoice;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to add invoice");
      }
    },
  },
};
// Create an Apollo Server instance
const server = new ApolloServer({ typeDefs, resolvers });

app.use(cors());
app.use(bodyParser.json());

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });

  // Connect to MongoDB
  const mongoUri = process.env.MONGO_DB;

  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected successfully"))
    .catch((err) => console.log("Error connecting to MongoDB:", err));

  // Start the Express server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(
      `GraphQL API available at http://localhost:${PORT}${server.graphqlPath}`
    );
  });
}

startApolloServer().catch((error) => {
  console.error("Error starting server:", error);
});
