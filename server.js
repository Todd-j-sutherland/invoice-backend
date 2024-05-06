const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const server = require("./apollo.js");

dotenv.config(); // to use environment variables from .env file

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
server.applyMiddleware({ app });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// Placeholder for Apollo Server setup and Passport setup

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
