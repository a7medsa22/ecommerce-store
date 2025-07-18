const path = require('path');
require('dotenv').config();

const express = require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: "config.env" })
const ApiError = require('./utils/apiError.js')
const globalError = require('./middleware/errorMiddleware')
const dbconnection = require("./config/connectDB");
const compression = require('compression');
const cors = require('cors')

//Routes
const mountRoutes = require('./routes');

//connect with DB
dbconnection();

//express app 
const app = express();
app.use(cors({
  origin: true, // or your specific domain
  credentials: true
}));
app.use(compression()); // Compress all routes


//middleware
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

if (process.env.NODE_ENV === "development") 
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);



//Mount Routes
mountRoutes(app);


app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});



///* */  *** this function Not Work ****
// app.all('/*', (req, res, next) => {
//     next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });


//Global error handling middleware for express
app.use(globalError);


const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} ...`)
});

process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection : ${err.name} | ${err.message}`);
    server.close(() => {    
        console.error("Shuting down....");
        process.exit(1);
    });
    
});

module.exports = app;