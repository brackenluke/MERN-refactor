const webToken = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'secrethere';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'Must have a Token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = webToken.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
      return res.status(400).json({ message: 'Invalid Token!' });
    }

    // send to next endpoint
    next();
  },
  authToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };

    return webToken.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
