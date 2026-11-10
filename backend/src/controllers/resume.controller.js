import Resume from "../models/Resume.js";
import { env } from "../config/env.js";

import { sanitizeResume } from "../utils/sanitizeResume.js";

// Only known resume fields are kept (never userId/_id/timestamps), coerced to
// the right types; every field is optional and empty entries are dropped.
const pick = (body = {}) => sanitizeResume(body);

export const createResume = async (req, res) => {
  const count = await Resume.countDocuments({ userId: req.user.id });
  if (count >= env.maxResumesPerUser) {
    return res.status(409).json({
      message: `You can keep up to ${env.maxResumesPerUser} resumes. Delete one to create another.`,
    });
  }

  const resume = await Resume.create({ ...pick(req.body), userId: req.user.id });
  res.status(201).json(resume);
};

export const getMyResumes = async (req, res) => {
  const resumes = await Resume.find({ userId: req.user.id }).sort({ updatedAt: -1 });
  res.json(resumes);
};

export const getResume = async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};

export const updateResume = async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { $set: pick(req.body) },
    { new: true, runValidators: true }
  );
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json(resume);
};

export const deleteResume = async (req, res) => {
  const resume = await Resume.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!resume) return res.status(404).json({ message: "Resume not found" });
  res.json({ message: "Resume deleted successfully" });
};
