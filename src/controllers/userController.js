const { StatusCodes } = require('http-status-codes');
const { User } = require('./../models/user');

const getUsers = async (req, res) => {
  const usersList = await User.find({});
  res.status(StatusCodes.OK).json(usersList);
};

const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  res.status(StatusCodes.OK).json(user);
};

const deleteUser = async (req, res) => {
  const deletedUser = await User.findByIdAndUpdate(req.params.id, {
    deleted: true,
  });
  res.status(StatusCodes.ACCEPTED).json(deletedUser);
};

const createUser = async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;
  const newUser = await User.create({ name, email, password, passwordConfirm });
  res.status(StatusCodes.CREATED).json(newUser);
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  createUser,
};
