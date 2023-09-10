// Define a middleware function for handling responses
const responseWrapper = (req, res, next) => {
    // Create a function to send success responses
    res.sendSuccess = (data) => {
      console.log(data)
      res.status(200).json(data);
    };
  
    // Create a function to send error responses
    res.sendError = (statusCode, message) => {
      res.status(statusCode).json({ success: false, error: message });
    };
  
    next(); // Continue with the next middleware
  };
  
  module.exports = responseWrapper;
  