// middlewares/error-handler.js

const errorHandler = (err, req, res, next) => {
  // Log the error details
  console.error(err.stack);

  // Determine the status code
  const statusCode = err.statusCode || 500;

  // Send the response with an appropriate message
  res.status(statusCode).send({
    message:
      statusCode === 500 ? "An internal server error occurred" : err.message,
  });
};

module.exports = errorHandler;
