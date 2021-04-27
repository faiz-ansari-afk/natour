const express = require('express');
const fs = require('fs');
const { Tour } = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find({});
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: 'Data not available',
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // req.body is from postman body ..in real world we can access this with our html page
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: 'Invalid data sent',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        // tour: tour
        tour
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  }
  catch(err){
    res.status(400).json({
      status: 'Fail',
      message: err.message
    })
  }
};
exports.deleteTour =async (req, res) => {
  try{
  await Tour.findByIdAndDelete(req.params.id)
  res.status(204).json({
    status: 'Success',
    data: null,
  });
}
catch(err){
res.send(err);
}
};
