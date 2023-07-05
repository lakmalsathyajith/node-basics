const { StatusCodes } = require('http-status-codes');
const { roles } = require('../server/roles');
const { jwt } = require('./../utils/jwt');
const { User } = require('./../models/user');
const AppError = require('../errors/appError');
const sendResponse = require('../utils/response');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new AppError(
      'Email or password field is missing',
      StatusCodes.UNAUTHORIZED
    );
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  const isCorrectPassword = await user.passwordCheck(password, user.password);
  if (!user || !isCorrectPassword) {
    throw new AppError('Incorrect password.', StatusCodes.UNAUTHORIZED);
  }

  const token = jwt.sign({
    id: user._id,
  });
  sendResponse(res, { token }, StatusCodes.CREATED);
};

const logout = async (req, res) => {
  sendResponse(res, {}, StatusCodes.OK);
};

const signUp = async (req, res) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
  const token = jwt.sign({
    id: newUser._id,
  });
  sendResponse(res, { user: newUser }, StatusCodes.CREATED);
};

const getMe = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(StatusCodes.OK).json(user);
};

// Role-based access control
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
      throw new Error(
        'Access not permitted to this role',
        StatusCodes.FORBIDDEN
      );
    }
    next();
  };
};

module.exports = {
  login,
  logout,
  getMe,
  signUp,
  grantAccess,
};
