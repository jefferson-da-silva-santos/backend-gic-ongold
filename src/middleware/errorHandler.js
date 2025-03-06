import logger from "../utils/logger.js";

function errorHandler(err, req, res, next) {
  logger.error(`Internal Server Error: ${err.message}`);
  return res.status(500).json({ error: `Internal Server Error: ${err.message}` });
}

export default errorHandler;