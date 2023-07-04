const { StatusCodes } = require('http-status-codes');
const { roles } = require('../server/roles');
const { jwt } = require('./../utils/jwt');
const { User } = require('./../models/user');

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // TODO: handle error
  }

  const user = await User.findOne({
    email,
  }).select('+password');

  const isCorrectPassword = await user.passwordCheck(password, user.password);

  console.log(user, isCorrectPassword, password, user.password);
  if (!user || !isCorrectPassword) {
    throw new Error();
    // TODO: handle error
  }

  const token = jwt.sign({
    id: user._id,
  });
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    data: {
      token,
    },
  });
};

const logout = async (req, res) => {
  const usersList = await User.find({});
  res.status(StatusCodes.OK).json(usersList);
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
  res.status(StatusCodes.CREATED).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
};

const getMe = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(StatusCodes.OK).json(user);
};

// Role-based access control
const grantAccess = (action, resource) => {
  // TODO: need to extend this to support multiple resources
  return async (req, res, next) => {
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
      // TODO: error handling need to be implemented
      throw new Error('Access not permitted to this role');
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
