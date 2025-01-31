function errorHandler(err, req, res, next) {
  res.status(500).json({ error: `Internal Server Error: ${err.message}` });
}

export default errorHandler;