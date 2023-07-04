const { StatusCodes } = require('http-status-codes');
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

  const isCorrectPassword = user.passwordCheck(password, user.password);

  if (!user || !isCorrectPassword) {
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
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
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

module.exports = {
  login,
  logout,
  getMe,
  signUp,
};
