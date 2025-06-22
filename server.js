const path = require('path');
require('dotenv').config();

const express = require('express');
const dotenv =  require('dotenv');
const morgan = require('morgan');

dotenv.config({ path: "config.env" })
const ApiError = require('./utils/apiError.js')
const globalError = require('./middleware/errorMiddleware')
const dbconnection = require("./config/connectDB");
//Route
const categoryRoute = require('./routes/categoryRoutes');
const subCategoryRoute = require("./routes/subCategoryRoutes");
const brandRoute = require("./routes/brandRoutes");
const productRoute = require("./routes/productRoutes");
const userRoute = require("./routes/userRoutes.js");
const authRoute = require("./routes/authRoutes.js");
const reviewRoute = require("./routes/reviewRoutes.js");

//connect with DB
dbconnection();

//express app 
const app = express();



//middleware
app.use(express.static(path.join(__dirname, 'uploads')));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
    console.log(`mode: ${process.env.NODE_ENV}`);
}


//Mount Routes
app.use("/api/v1/categories/", categoryRoute);
app.use("/api/v1/subcategories/", subCategoryRoute);   
app.use("/api/v1/brands/", brandRoute);
app.use("/api/v1/products/", productRoute);   
app.use("/api/v1/users/", userRoute);   
app.use("/api/v1/auth/", authRoute); 
app.use("/api/v1/reviews/", reviewRoute);
  


app.use((req, res, next) => {
    next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});



///* */  *** this function Not Work ****
// app.all('/*', (req, res, next) => {
//     next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
// });


//Global error handling middleware for express
app.use(globalError);


const PORT = process.env.PORT;

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