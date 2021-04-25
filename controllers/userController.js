const express = require('express');
const fs = require('fs');


const users = JSON.parse(
    fs.readFileSync(`${__dirname}/../dev-data/data/users.json`)
  );
exports.checkID = (req, res, next, val) => {

  next();
}
exports.getAllUsers = (req, res) => {
    res.status(500).json({
      status: 'Error',
      message:"This route is not yet defined"
    });
  };
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