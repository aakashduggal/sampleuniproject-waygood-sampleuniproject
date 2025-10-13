const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from x-auth-token or Authorization header
  let token = req.header('x-auth-token');
  if (!token) {
    const authHeader = req.header('Authorization') || req.header('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Token payload format: { admin: { id: ... } }
    req.admin = decoded.admin || decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;