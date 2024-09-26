const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;

  // Log detailed validation errors
  if (err.joi) {
    console.error(
      `Validation error details: ${JSON.stringify(err.joi.details)}`
    );
  }

  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An internal server error occurred" : err.message,
  });
};

module.exports = errorHandler;
