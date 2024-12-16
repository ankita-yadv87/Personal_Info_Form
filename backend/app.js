const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");
const errorHandler = require("./middleware/error")

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); // Frontend URL
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials like cookies
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Imports
const user = require("./routes/userRoute");

const corsOptions = {
  origin: "http://localhost:5173", 
  credentials: true,  
};

  app.use(cors(corsOptions)); 

app.use("/api/v1",user);
app.use(errorHandler);


module.exports = app;