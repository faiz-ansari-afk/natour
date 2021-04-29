class APIFeatures {
    constructor(query, queryStr) {
      // here 'query' is from database query and.... 'queryStr' is refered to query that is coming from URL
      this.query = query;
      this.queryStr = queryStr;
    }
    filter() {
      // shallow copy || hard copy trick.... three dots mean we basically take all the  fields out of the object
      // with curly braces we make object of it
      const queryObj = { ...this.queryStr };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((el) => delete queryObj[el]);
      // 2] Advanced Filtering
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
    sorting() {
      // query.sort here sort comes from excludedFields array
      if (this.queryStr.sort) {
        const sortBy = this.queryStr.sort.split(',').join(' ');
        // console.log(sortBy)
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      // eg: if user want only name,duration and price field only (localhost:8000/api/v1/tours?fields=name,price)
      if (this.queryStr.fields) {
        const fields = this.queryStr.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginate() {
      // 5] Pagination and Limiting -----------(localhost:8000/api/v1/tours?page=2&limit=10)
      // --------------------------------------page=2&limit=10 means    1 -10 results on page 1 , 11 -20 results on page 2
      const page = this.queryStr.page * 1 || 1;
      const limit = this.queryStr.limit * 1 || 100;
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      // const numTours = await Tour.countDocuments();
      // if (skip >= numTours) {
      //   throw new Error('This page does not exist');
      // }
      return this;
    }
  }
  module.exports = APIFeatures;