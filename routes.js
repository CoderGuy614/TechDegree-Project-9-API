const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const nameValidator = check("name");
const User = require("./models").models.User;
const Course = require("./models").models.Course;

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
// Get Users Route
router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    console.log("req");
    res.json(users);
  })
);

// Post a new user route
//Required fields Course:  title, description
router.post(
  "/users",
  [
    check("firstName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "First name"'),
    check("lastName")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "Last name"'),
    check("emailAddress")
      .isEmail()
      .withMessage("Please enter a valid email address"),
    check("password")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "password"')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      password: bcryptjs.hashSync(req.body.password)
    });
    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }
);

// Get Courses Route
router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: User,
          as: "userInfo",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.json(courses);
  })
);

// Post a new course route
//Required fields Course:  title, description
router.post(
  "/courses",
  [
    check("title")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "title"'),
    check("description")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "description"'),
    check("userId")
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please provide a value for "userId"')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    Course.create({
      title: req.body.title,
      description: req.body.description
    });
    // Set the status to 201 Created and end the response.
    res.status(201).end();
  }
);

module.exports = router;
