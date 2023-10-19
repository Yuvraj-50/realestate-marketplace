const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const error = require("../utlis/error");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return next(error(403, "All field are required"));
    }

    const saltRounds = 10;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return next(error(403, "User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: "user created successfully",
    });
  } catch (err) {
    next(err);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(error(401, "All fields are required"));
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return next(error(404, "wrong credentials"));
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);

    if (!validPassword) {
      return next(error(401, "wrong credentials"));
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);

    res.cookie("access_token", token, { httpOnly: true });

    const { password: pass, ...rest } = existingUser._doc;

    res.status(200).json({
      success: true,
      data: rest,
    });
  } catch (err) {
    next(err);
  }
};

const signInWithGoogle = async (req, res, next) => {
  try {
    const { username, email, photo } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = jwt.sign({ id: existingUser._id }, process.env.SECRET_KEY);

      res.cookie("access_token", token, { httpOnly: true });

      const { password: pass, ...rest } = existingUser._doc;

      res.status(200).json({
        success: true,
        data: rest,
      });
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const saltRounds = 10;

      const hashedPassword = await bcrypt.hash(generatedPassword, saltRounds);

      const newUser = await new User({
        username:
          username.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });

      newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY);

      const { password: pass, ...rest } = newUser._doc;

      res.cookie("access_token", token, { httpOnly: true });

      res.status(200).json({
        success: true,
        data: rest,
      });
    }
  } catch (err) {
    next(err);
  }
};

const signOut = (req, res, next) => {
  if (req.params.id !== req.user.id) {
    return next(error(403, "You are not allowed to perform this action"));
  }
  
  try {
    res.clearCookie("access_token");

    res.status(200).json({
      success: true,
      data: "user signed out successfully",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { signup, signin, signInWithGoogle, signOut };
