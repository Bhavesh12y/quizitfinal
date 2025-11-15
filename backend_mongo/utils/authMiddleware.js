const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'verysecretkey';

exports.verify = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// optional middleware: attach user if token present
exports.optional = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return next();
  }
};
