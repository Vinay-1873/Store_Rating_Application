const jwt = require('jsonwebtoken');

// 1. Verify the JWT Token
const verifyToken = (req, res, next) => {
  let token;
  
  // Check if the Authorization header exists and starts with "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract the token part
  }

  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'You are not logged in. Please provide a valid token.' 
    });
  }

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded payload (userId and role) to the request object
    req.user = decoded;
    
    next(); // Move to the next middleware or controller
  } catch (error) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Invalid token or token has expired. Please log in again.' 
    });
  }
};

// 2. Role-Based Access Control (RBAC)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user.role was set in the verifyToken middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'You do not have permission to perform this action.' 
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  restrictTo
};