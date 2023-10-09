const jwt = require("jsonwebtoken");
const error = require("./error");

const verifyUser = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(error(401, "Unauthorized user"));
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return next(error(403, "Forbidden user"));
    req.user = user;
    next();
  });
};

module.exports = verifyUser;
