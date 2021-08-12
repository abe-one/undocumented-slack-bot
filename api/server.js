const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const server = express();
const reactionsRouter  = require('./reactions/reactions-router')

server.use(express.json());
server.use(helmet());
server.use(cors());

server.use("/reactions", reactionsRouter)

server.use("*", (_req, res) => {
  res.status(200).json({ message: "server up" });
});


// eslint-disable-next-line no-unused-vars
server.use((err, _req, res, _next) => {
  res.status(err.status || 500).json({
    message: err.message || "server error",
  });
});

module.exports = server;
