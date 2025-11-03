const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const { rateLimit } = require("express-rate-limit");

const ApiError = require("./utils/apiError.js");
const globalError = require("./middleware/errorMiddleware");
const dbconnection = require("./config/connectDB");
const compression = require("compression");
const cors = require("cors");
const { webhookCheckout } = require("./services/orderService.js");

//Routes
const mountRoutes = require("./routes");

//connect with DB
dbconnection();

//express app
const app = express();

app.set("trust proxy", 1);


app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
});

app.use(
  cors({
    origin: true, // or your specific domain
    credentials: true,
  })
);
app.use(compression()); // Compress all routes
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webhookCheckout
);

//middleware
app.use(express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "10kb" }));

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
console.log(`mode: ${process.env.NODE_ENV}`);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  legacyHeaders: false,
  standardHeaders: true,
});
app.use("/api/", limiter);

//app.use(csrf({ cookie: true }));
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
  console.log(`Server running on port: ${PORT} ...`);
});

process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection : ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shuting down....");
    process.exit(1);
  });
});

module.exports = app;
