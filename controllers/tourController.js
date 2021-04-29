const express = require('express');
const fs = require('fs');
const { Tour } = require('../models/tourModel');
const APIFeatures = require('../utils/apifeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name,price,duration';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sorting()
      .paginate()
      .limitFields();
    const tours = await features.query;

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
      message: err,
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
      status: err,
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
        tour,
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
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.send(err);
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { 
        $match: { ratingsAverage: { $gte: 4.5 } } // we can match multiple data
      },
      { 
        $group: { 
        _id: {$toUpper:'$difficulty'},
          numTours: {$sum: 1},
          numRatings: {$sum : '$ratingsQuantity'},
          avgRating:{$avg:'$ratingsAverage'},
          avgPrice:{$avg : '$price' },
          minPrice:{$min : '$price' },
          maxPrice:{$max : '$price' }
        } 
      },{
        $sort:{avgPrice: 1} // 1 for ascending order
      }
    ]);
    res.status(200).json({
      status: 'Success',
      data: {
        tour: stats
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
};
exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-01`)
          }
        }
      },
      {
        $group: {
          _id:{ $month: '$startDates'},
          numTourStarts: { $sum: 1} ,// 1 for each documents
          tours: { $push: '$name'}
        }
      },
      {
        $addFields: { month: '$_id'}
      },
      {
        $project:{_id:0}// 0 to not show the id field
      },
      {
        $sort: { numTourStarts: -1} // 1 sort in ascending order and -1 for descending order
      },
      {
        $limit: 12  // limit the documents to be displayed
      }
    ]);
    res.status(200).json({
      status: 'Success',
      data: {
         plan
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err.message,
    });
  }
}