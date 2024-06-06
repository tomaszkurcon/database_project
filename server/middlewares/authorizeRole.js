const authorizeRole = (roles) => {
    return (req, res, next) => {
      if (!req.user || !req.user.roles || !req.user.roles.some(role => roles.includes(role))) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    };
  }
  module.exports = authorizeRole;