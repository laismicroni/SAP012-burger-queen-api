const jwt = require('jsonwebtoken');
const config = require('../config');

const { secret } = config;

module.exports = (app, nextMain) => {

  app.post('/login', (req, resp, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(400);
    }

    // TODO: Authenticate the user
    // It is necessary to confirm if the email and password
    // match a user in the database
    // If they match, send an access token created with JWT

    const user = authenticateUser(email, password);

    if (!user) {
      return next(401); 
    }

    const token = jwt.sign({
      email: user.email,
      role: user.role,
    }, secret);

    resp.json({ token });

    next();
  });

  return nextMain();
};
