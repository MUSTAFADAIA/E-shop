const fs = require("fs");
require("colors");
const dotenv = require("dotenv");
const Product = require("../../models/productmodel");
// const dbConnection = require("../../config/database");
const mongoose = require("mongoose");

dotenv.config({ path: "../../config.env" });

// connect to DB

const dbConnection = () => {
  mongoose
    .connect(
      "mongodb+srv://mustafa:pCE4c5enb0qQZ7yH@cluster0.tigmoa7.mongodb.net/ecommerce-db?retryWrites=true&w=majority"
    )
    .then((conn) => {
      console.log(`Database connected:${conn.connection.host}`);
    }); //.catch((err)=>{
  //     console.log(`Database Error: ${err}`)
  //     process.exit()
  // })
};
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log("Data Inserted".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
