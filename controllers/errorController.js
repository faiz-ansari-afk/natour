const AppError = require('./../utils/appError');

const handleCastErrorDB = function(err) {
    const message = `Invalid ${err.path}: ${err.value}` ;
    return new AppError(message, 400);

}
const handleDuplicateFieldsDB = function(err){
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
  console.log(value) 
  const message = `Duplicate field value: ${err.keyValue.name}, Please try something NEW 😁`;
  return new AppError(message, 400)
}
const handleValidationErrorDB = function(err){
  const errors = Object.values(err.errors).map(val => {
    return val.message
    // console.log(val.message)
  })
  const message = `Invalid Input Data, ${errors.join('. ')} `;
  return new AppError(message, 400)
}
const handleJWTError = err => new AppError('Invalid token, Please login again',401)
const handleExpiredTokenError = err => new AppError('Token Expire, Please login again',401)

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
      //creating hardcopy of err
      let errorHardCopy = {...err}
      //Error produce by mongoose which doesnt come under isOperational...... we have to make these error as isOperation===true
      //below function is to convert wierd mongoose error to isOperational===true(trusted error)
      if(err.name === 'CastError' ) errorHardCopy = handleCastErrorDB(err);
      if(errorHardCopy.code === 11000) errorHardCopy = handleDuplicateFieldsDB(err);
      if(err.name=== 'ValidationError') errorHardCopy = handleValidationErrorDB(err);
      if(err.name=== 'JsonWebTokenError') errorHardCopy = handleJWTError();
      if(err.name=== 'TokenExpiredError') errorHardCopy = handleExpiredTokenError();
    sendErrorProd(errorHardCopy , res);
  }
};
