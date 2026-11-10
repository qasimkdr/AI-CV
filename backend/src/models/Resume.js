import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    template: { type: String, default: "modern", trim: true },

    personalInfo: {
      fullName: String,
      title: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
    },

    summary: String,

    education: [
      {
        institute: String,
        degree: String,
        startYear: String,
        endYear: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        startDate: String,
        endDate: String,
        description: String,
      },
    ],

    skills: [String],

    projects: [
      {
        title: String,
        description: String,
      },
    ],

    certifications: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
