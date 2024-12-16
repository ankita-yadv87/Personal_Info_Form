const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/db");
const cors = require('cors');
const cookieParser = require("cookie-parser");

//handling  uncaught exception
process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
})

dotenv.config({ path: "./config/config.env" })
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.origin); // Frontend URL
  res.setHeader("Access-Control-Allow-Credentials", "true"); // Allow credentials like cookies
  next();
});

const corsOptions = {
  origin: process.env.origin, 
  credentials: true,  
};

app.use(cookieParser());
app.use(cors(corsOptions));


//connecting to database
connectDatabase();


const server = app.listen(process.env.PORT, () => {
  console.log(`app is listening on port : ${process.env.PORT}`)
})

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);

  server.close(() => {
    process.exit(1);
  })

});