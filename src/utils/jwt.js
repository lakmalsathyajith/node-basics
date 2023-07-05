const jwt = require('jsonwebtoken');
const { User } = require('../models/user');
const AppError = require('../errors/appError');
const { StatusCodes } = require('http-status-codes');

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
    token = req.headers.authorization.split(' ')[1].trim();
  }

  if (!token) {
    throw new AppError(
      'This route is protected. Please log in.',
      StatusCodes.UNAUTHORIZED
    );
  }

  // adding this to make it a promise to be catch in the error catcher
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  // check whether the user is deleted in the middle.
  const existingUser = await User.findById(decodedToken.id);
  if (!existingUser) {
    throw new AppError(
      'User not exists. Please log in again.',
      StatusCodes.UNAUTHORIZED
    );
  }

  // check whether the given user is changed password after token creation.
  if (existingUser.tokenTimestampValidate(decodedToken.iat)) {
    throw new AppError(
      'Token expired. Please log in again',
      StatusCodes.UNAUTHORIZED
    );
  }

  // make user available in the request after successful authentication.
  req.user = existingUser;
  next();
};

exports.jwt = {
  sign,
  protected,
};
