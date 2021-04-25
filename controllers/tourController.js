const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);
exports.checkBody = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  if (!name || !price){
    return res.status(400).json({
      status: 'Fail',
      message: 'Missing name and price',
    });
  }
  next();
}
exports.checkID = (req, res, next, val) => {
  console.log("tour id is" + val)
  // req.params.id and val is two different strings
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'Fail',
      message: 'Invalid ID',
    });
  }
  next();
}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      // tours:tours
      tours,
    },
  });
};
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        console.log(err);
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.getTour = (req, res) => {
  // converting string iD into  Integer ID by this trick
  const id = req.params.id * 1;

  const tour = tours.find((el) => {
    if (el.id === id) {
      return el;
    }
  });
  
  res.status(200).json({
    status: 'Success',
    data: {
      // tour: tour
      tour,
    },
  });
};
exports.updateTour = (req, res) => {

  res.status(200).json({
    status: 'Success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};
exports.deleteTour = (req, res) => {
  
  res.status(204).json({
    status: 'Success',
    data: null,
  });
};
