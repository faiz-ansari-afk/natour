const express = require('express');
const fs = require('fs');
const { Tour } = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    // shallow copy || hard copy trick.... three dots mean we basically take all the  fields out of the object
    // with curly braces we make object of it
    // 1] Filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    // 2] Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // const tours = await Tour.find(queryObj);.........we cannot use sort or another property if we await the query
    // using below trick to do all the sorting and other methods on query and then we await the tours
    let query = Tour.find(JSON.parse(queryStr));
    // 3] Sorting
    // query.sort here sort comes from excludedFields array
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      // console.log(sortBy)
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // 4] Field Limiting Features
    // eg: if user want only name,duration and price field only (localhost:8000/api/v1/tours?fields=name,price)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

// 5] Pagination and Limiting -----------(localhost:8000/api/v1/tours?page=2&limit=10)
// -------------------------------------------------------page=2&limit=10 means    1 -10 results on page 1 , 11 -20 results on page 2
    if(req.query.page){
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);
    const numTours = await Tour.countDocuments();
    if(skip >= numTours){
      throw new Error("This page does not exist");
    }

    }
    const tours = await query;

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
