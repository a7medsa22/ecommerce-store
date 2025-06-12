const {validationResult} = require('express-validator');
//@desc find the validation error in this request and wraps them in an object with handle func. 

const validatorMiddleware = (req, res,next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    };
    next();
};
module.exports = validatorMiddleware;