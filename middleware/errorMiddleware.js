const globalError = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res);
    } else {
        if (err.name === "JsonWebTokenError") { err = "Invalid token, please login again"}
        if (err.name === "TokenExpiredError") {err = "Expire token, please login again"}
        sendErrorProd(err, res);
    }
};

const sendErrorDev = (err, res) => {
return  res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err,res) => {
return  res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
});
};


module.exports = globalError;