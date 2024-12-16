const ErrorHandler = require("../services/errorHandler");

module.exports = (err, req, res, next)=>{
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

     // Wrong Mongodb Id error
   if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0]; // Get the field causing the error
    const message = `${field} already exists. Please use a different ${field}.`;
    err = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again `;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });

}