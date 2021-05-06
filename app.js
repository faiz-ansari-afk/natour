const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
var globalErrorHandler = require('./controllers/errorController');
const app = new express();
app.use(express.json());
 
app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// (process.env.NODE_ENV) 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
    
}
app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString();
    console.log(req.headers);

    next();
})

// using middleware to create separate routes
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter);

app.all('*' , (req,res,next) => {
    // res.status(404).json({
    //     status:'Fail',
    //     message:`Can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on the server`);
    // err.status = 'Fail';
    // err.statusCode = 404;
    // next(err);
    // console.log(x);
    //Sending to the AppError class 
    next(new AppError(`Can't find ${req.originalUrl} on the server`,404))
});
// Creating Error handlers middleware
app.use(globalErrorHandler)

module.exports = app 
