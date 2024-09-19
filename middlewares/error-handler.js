function errorHandler(err, req, res, next) {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).send({
    message:
      statusCode === 500
        ? "An unexpected error occurred on the server."
        : err.message,
  });
}

module.exports = errorHandler;
