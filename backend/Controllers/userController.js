const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const error = require("../utlis/error");

async function updateUser(req, res, next) {
  if (req.user.id !== req.params.id) {
    return next(error(403, "you can update only your account"));
  }

  try {
    if (req.body.username == "") {
      return next(error(403, "username is required"));
    }

    if (req.body.email === "") {
      return next(error(403, "email is required"));
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const existingUser = await User.findById(req.params.id);

    console.log(existingUser.email, req.body.email);

    if (existingUser.email === req.body.email) {
      return next(error(403, "Email already in use"));
    }

    if (existingUser.username === req.body.username) {
      return next(error(403, "Username already in use"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({
      success: "success",
      data: rest,
    });
  } catch (error) {
    next(error);
  }
}

const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(error(403, "you can delete only own account"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({
      success: "success",
      data: "user deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { updateUser, deleteUser };
