const { body } = require("express-validator");

const userDataValidateChainMethod = [
  body("name")
    .exists({ checkFalsy: true })
    .withMessage("Name is required")
    .isString()
    .withMessage("Name should be string"),
  body("email").optional().isEmail().withMessage("Provide valid email"),
  body("gender")
    .exists({ checkFalsy: true })
    .withMessage("Gender is required")
    .isString()
    .withMessage("Gender should be string"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters")
];

const userLoginValidate = [
  body("email").optional().isEmail().withMessage("Provide valid email"),
  body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 5 })
    .withMessage("Password should be at least 5 characters")
];

const searchDataValidate = [
  body("pageNumber")
  .custom((value) => {
    if (value<= 0) {
      return Promise.reject("Invalid page number, should start with 1.");
    } else {
      return true;
    }
  })
];

module.exports = {
  userDataValidateChainMethod,
  userLoginValidate,
  searchDataValidate
};
