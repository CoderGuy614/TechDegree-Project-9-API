//TreeHouse TechDegree Project 9 - REST API with Authorization
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const nameValidator = check("name");
const auth = require("basic-auth");
const User = require("./models").models.User;
const Course = require("./models").models.Course;

//Async function handler
function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}
// User Authentication - password hashing
const authenticateUser = async (req, res, next) => {
  let message = null;
  const users = await User.findAll();
  const credentials = auth(req);
  if (credentials) {
    const user = users.find(u => u.emailAddress === credentials.name);
    if (user) {
      const authenticated = bcryptjs.compareSync(
        credentials.pass,
        user.password
      );
      if (authenticated) {
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Authorization header not found";
  }
  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
//*************************  Routes ************************** //
// Get Users - Returns the authorized user
router.get(
  "/users",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const authUser = req.currentUser;
    const user = await User.findByPk(authUser.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"]
      }
    });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  })
);

// Post a new user route
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
      .withMessage('Please provide a value for "password"'),
    check("emailAddress").custom(value => {
      return User.findOne({ where: { emailAddress: value } }).then(user => {
        if (user) {
          return Promise.reject("Email address already exists");
        }
      });
    })
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(422).json({ errors: errors.array() });
    } else {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailAddress: req.body.emailAddress,
        password: bcryptjs.hashSync(req.body.password)
      }).then(() => {
        res
          .status(201)
          .location("/")
          .end();
      });
    }
  })
);

// Get All Courses Route
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
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.status(200).json(courses);
  })
);
//Get a specific course by ID
router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"]
          }
        }
      ]
    });
    res.status(200).json(course);
  })
);

// Post a new course route (Protected)
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.create(req.body);
    res
      .status(201)
      .location("/courses/" + course.id)
      .end();
  })
);
// Update a course (Protected)
router.put(
  "/courses/:id",
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const course = await Course.findByPk(req.params.id);
    const authUser = req.currentUser;
    if (authUser.id === course.userId) {
      course.update(req.body);
      res.status(204).end();
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to update this course" });
    }
  })
);
// Delete a course (protected)
router.delete(
  "/courses/:id",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    const authUser = req.currentUser;
    if (authUser.id === course.userId) {
      course.destroy(req.body);
      res.status(204).end();
    } else {
      res
        .status(403)
        .json({ message: "You are not authorized to delete this course" });
    }
  })
);

module.exports = router;
