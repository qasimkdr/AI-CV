import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
      });

    const token =
      generateToken(
        user._id
      );

    res.status(201).json({
      message:
        "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const login = async (
  req,
  res
) => {
  try {
    const {
      email,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid credentials",
      });
    }

    const token =
      generateToken(
        user._id
      );

    res.json({
      message:
        "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};

export const logout = async (
  req,
  res
) => {
  res.json({
    message:
      "Logged out",
  });
};

export const getMe = async (
  req,
  res
) => {
  const user =
    await User.findById(
      req.user.id
    ).select(
      "-password"
    );

  res.json(user);
};

export const updateProfile = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await User.findById(
        req.user.id
      );

    if (!user) {
      return res.status(404).json({
        message:
          "User not found",
      });
    }

    if (email && email !== user.email) {
      const emailExists =
        await User.findOne({
          email,
          _id: {
            $ne: user._id,
          },
        });

      if (emailExists) {
        return res.status(400).json({
          message:
            "Email already in use",
        });
      }
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message:
            "Current password is required",
        });
      }

      const isMatch =
        await bcrypt.compare(
          currentPassword,
          user.password
        );

      if (!isMatch) {
        return res.status(400).json({
          message:
            "Current password is incorrect",
        });
      }

      user.password =
        await bcrypt.hash(
          newPassword,
          10
        );
    }

    user.name =
      name || user.name;
    user.email =
      email || user.email;

    await user.save();

    res.json({
      message:
        "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message:
        error.message,
    });
  }
};
