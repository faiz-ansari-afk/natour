const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');
const app = require('./app');

//------------------------------------------- connecting to database-----------------------------------------
// const DB = process.env.DATABASE;
const DB= process.env.DATABASE_LOCAL
try {
  // Connect to the MongoDB cluster
   mongoose.connect(
    DB,
    { useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex: true,useFindAndModify: false},
    () => console.log(" Mongoose is connected")
  );
} catch (e) {
  console.log("could not connect");
}

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
  console.log('🌍 Server started at 8000');
});
