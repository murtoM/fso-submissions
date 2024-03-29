const jwt = require("jsonwebtoken");

const logger = require("./logger");
const User = require("../models/user");

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: "token invalid" });
  }

  request.user = await User.findById(decodedToken.id);
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.message) {
    logger.error(error.message);
  }

  switch (error.name) {
    case "CastError":
      return response.status(400).send({ error: "malformed id" });
    case "ValidationError":
      return response.status(400).json({ error: error.message });
    case "InvalidRequest":
      return response.status(400).send({ error: "invalid request" });
    case "ContentMissing":
      return response.status(400).send({ error: "content missing" });
    case "JsonWebTokenError":
      return response.status(401).send({ error: "token missing or invalid" });
    case "TokenExpiredError":
      return response.status(401).send({ error: "token expired" });
  }

  next(error);
};

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
