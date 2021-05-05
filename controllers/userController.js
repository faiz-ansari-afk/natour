const User = require('./../models/userModel');
const APIFeatures = require('../utils/apifeatures');
const catchAsync = require('../utils/catchAsyncError');
const AppError = require('./../utils/appError');


exports.getAllUsers = catchAsync(async (req, res, next) => {
  // const users = await features.query;
  const users = await User.find({});

  res.status(200).json({
    status: 'Success',
    results: users.length,
    data: {
      users
    },
  });
  })
exports.createUser = (req, res) => {
    res.status(500).json({
      status: 'Error',
      message:"This route is not yet defined"
    });
  };
exports.getUser = (req, res) => {
    res.status(500).json({
      status: 'Error',
      message:"This route is not yet defined"
    });
  };
exports.updateUser = (req, res) => {
    res.status(500).json({
      status: 'Error',
      message:"This route is not yet defined"
    });
  };
exports.deleteUser = (req, res) => {
    res.status(500).json({
      status: 'Error',
      message:"This route is not yet defined"
    });
  };