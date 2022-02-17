const { validationResult } = require("express-validator");

function validator(validations) {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      error: {
        message: errors.array()[0].msg,
      },
    });
  };
}

module.exports = validator;
