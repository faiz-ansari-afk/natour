const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    error: err,
  });
};
const sendErrorProd = (err, res) => {
//operational, trusted error: send error message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
//   programming or other unknown error: don't leak error details to client
  else{
      //1] Log the error 
        console.error('ERROR 🤷‍♂️ ',err)
      //2] Send genric message
      res.status(500).json({
          status: 'Error',
          message: 'Something went wrong'
      })
  }
};
// Global Error Handling middleware
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  }
};
