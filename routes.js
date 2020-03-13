const express = require("express");

const router = express.Router();

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

router.get(
  "/users",
  asyncHandler(async (req, res) => {
    const users = await User.findAll();
    console.log("req");
    res.json(users);
  })
);

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
    console.log(courses);
    res.json(courses);
  })
);
module.exports = router;
