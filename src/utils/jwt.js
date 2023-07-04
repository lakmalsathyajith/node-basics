const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { User } = require('../models/user');

const sign = (options) =>
  jwt.sign(
    {
      ...options,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRATION_IN,
    }
  );

const protected = async (req, res, next) => {
  const authorization = req.headers.authorization;
  let token;
  if (authorization && authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
    console.log(token);
  }

  if (!token) {
    // TODO: handle invalid token here
    throw new Error('This route is protected.');
  }

  // adding this to make it a promise to be catch in the error catcher
  const decodedToken = await promisify(jwt.verify)(
    (token, process.env.JWT_SECRET)
  );

  // check whether the user is deleted in the middle.
  const existingUser = await User.findById(decodedToken.id);
  if (!existingUser) {
    // TODO prompt error
  }

  // check whether the given user is changed password after token creation.
  if (existingUser.tokenTimestampValidate(decodedToken.iat)) {
    // TODO prompt error
  }

  req.user = existingUser;
  next();
};

exports.jwt = {
  sign,
  protected,
};
