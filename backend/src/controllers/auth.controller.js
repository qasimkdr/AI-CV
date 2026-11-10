import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const normEmail = (email) => (typeof email === "string" ? email.trim().toLowerCase() : "");
const publicUser = (u) => ({ id: u._id, name: u.name, email: u.email });

// Older accounts may have been stored with mixed-case emails.
const findByEmail = (raw) => {
  const email = normEmail(raw);
  const variants = [...new Set([email, typeof raw === "string" ? raw.trim() : email])];
  return User.findOne({ email: { $in: variants } });
};

export const signup = async (req, res) => {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = normEmail(req.body?.email);
  const password = req.body?.password;

  if (!name) return res.status(400).json({ message: "Name is required" });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address" });
  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  if (await findByEmail(req.body.email)) {
    return res.status(400).json({ message: "An account with this email already exists" });
  }

  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });

  res.status(201).json({
    message: "User created successfully",
    token: generateToken(user._id),
    user: publicUser(user),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  res.json({ message: "Login successful", token: generateToken(user._id), user: publicUser(user) });
};

export const logout = (req, res) => {
  res.json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(401).json({ message: "Account no longer exists" });
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { name, currentPassword, newPassword } = req.body || {};
  const email = req.body?.email ? normEmail(req.body.email) : "";

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (email && email !== user.email.toLowerCase()) {
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: "Please enter a valid email address" });
    const taken = await User.findOne({ email, _id: { $ne: user._id } });
    if (taken) return res.status(400).json({ message: "Email already in use" });
    user.email = email;
  }

  if (newPassword) {
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }
    if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  if (typeof name === "string" && name.trim()) user.name = name.trim();

  await user.save();
  res.json({ message: "Profile updated successfully", user: publicUser(user) });
};
