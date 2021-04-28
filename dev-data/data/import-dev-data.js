
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const fs= require('fs');
const mongoose = require('mongoose');
const {Tour} = require(`${__dirname}/../../models/tourModel`);

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
// Read json file..
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

// Import data into database
const importData = async ()=>{
    try{
        await Tour.create(tours);
        console.log("Data successfully loaded...💕");
        process.exit();
    } 
    catch(err){
        console.log(err)
    }
}
// delete all data from db
const deleteData = async()=>{
    try {
        const result = await Tour.deleteMany({});
        console.log("Successfully deleted all items from db 😂  "+ result.deletedCount);
        process.exit();
    } catch (error) {
        console.log(error)
    }
}
if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2]==='--delete'){
    deleteData();
}
// importData