const express = require('express');
const morgan = require('morgan');
const app = new express();
app.use(express.json());
 
app.use(express.static(`${__dirname}/public`));

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

console.log(process.env.NODE_ENV) 
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
app.use((req,res,next)=>{
    console.log("hello from middleware😊");
    next();
})


// using middleware to create separate routes
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter);


module.exports = app 
