const mongoose =require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema =new mongoose.Schema({
    name:{
      type:String,
      required:[true,"A tour must have a name"],
      unique:true,
      trim:true,
      // not working min max
      maxlength:[40,'A tour name must be short and precise'],
      minlength:[10,'Not that short and precise'],
      // validate: [validator.isAlpha,'Tour Name must only contains character']
    },
    slug:String,
    duration:{
      type:Number,
      required:[true,"A tour must have a duration"]
    },
    maxGroupSize:{
      type:Number,
      required:[true,"A tour must have a group size"],
    },
    difficulty:{
      type:String,
      required:[true,"A tour must have a difficulty"],
      enum : {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium and difficult'
      }
    },

    ratingsAverage:{
      type:Number,
      default:4.5,
      min: [1,'Rating must be above 1.0'],
      max: [5,'Rating must below 5.0'],
    },
    ratingsQuantity:{
      type:Number, 
      default:0
    },
    price:{
      type:Number,
      required:[true,"A tour must have a price"]
    },
    priceDiscount:{ 
      type:Number,
      // add custom validator like
      //only works when creating new document and not on update
      validate:{
      validator: function(value){
        return value < this.price
      },
      message: 'Discount price ({VALUE}) should below the regular price' 
      // ({VALUE}) it will have access to the value.. its mongoose property not js

    }
    },
    summary:{
      type:String,
      trim: true,
      required:true
    },
    description:{
      type:String,
      trim: true
    },
    imageCover:{
      type:String,
      required:[true,"A tour must have a Cover image"]
    },
    images:[String],
    createdAt:{
      type:Date,
      default: Date.now(),
      select:false
    },
    startDates:[Date],
    secretTour:{
      type: Boolean,
      default: false
    }

  },
  {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
  });
  tourSchema.virtual('durationWeeks').get(function (){
    return this.duration / 7;
  })
  // creating DOCUMENT MIDLLEWARE from mongoose
  // this middleware will run before .save() and .create()  but this middleware will not be triggered by .insertMany()
  // below middleware is called pre save hook, where save is hook....we can have multiple middleware
  // tourSchema.pre('save',function(next){
  //   // this keyword point towards the current processed documents
  //   this.slug = slugify(this.name , {lower:true});
  //   next();
  // });
  // tourSchema.post('save', function(doc,next){
  //   console.log(doc);
  //   next();
  // })
  // QUERY MIDDLEWARE...processing query
  //    /^find/   this re will trigger middleware for every  query starts with find...
  tourSchema.pre(/^find/,function(next){
this.find({secretTour: {$ne:true}})
    next();
  })

  // AGGREGATION MIDDLEWARE 
  tourSchema.pre('aggregate',function(next){
    // unshift to add in the beginning of the array
    this.pipeline().unshift({$match:{secretTour: {$ne:true}}})
    // console.log(this.pipeline())
    next();
  })
exports.Tour = new mongoose.model("Tour",tourSchema)