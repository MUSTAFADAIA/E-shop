const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const dbConnection = require("./config/database");
const globalError = require("./middleware/errorMiddleware");
const ApiError = require("./utils/apiError");
const mountRoutes = require("./routes");
const cors = require('cors')
const compression = require('compression')
const { webhookCheckout } = require('./controller/orderController');




dotenv.config({ path: "conflig.env" });

//conectoindb
dbConnection();
//express app
const app = express();
app.use(cors())
app.options('*', cors())

//Compress all req and res for me
app.use(compression())

// Checkout webhook
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);


//Middlewares
app.use(express.json()); ///jsonبحولهاالى bodyبتحول كل النصوص الي جايه من
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "developme") {
  app.use(morgan("dev"));
  console.log(`mode : ${process.env.NODE_ENV}`);
}

mountRoutes(app);

app.all("*", (req, res, next) => {
  //Create error and send it to error handling middleware
  // const err = new Error(`Cant find this route:${req.originalUrl}`)
  // next(err.message)
  //
  next(new ApiError(`Cant find this route:${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT;
const server = app.listen(PORT ||8000, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle rejection outside exprees
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Errors: ${err.name}|${err.message}`);
  server.close(() => {
    console.error(`Shutting down...`);
    process.exit(1);
  });
});
