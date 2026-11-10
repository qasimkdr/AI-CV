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
    field: { type: String, default: "" },

    // Section order and visibility: [{ id: "experience", enabled: true }]
    sections: [{ _id: false, id: String, enabled: { type: Boolean, default: true } }],

    personalInfo: {
      fullName: String,
      title: String,
      email: String,
      phone: String,
      address: String,
      photo: String, // small data URL (compressed on the client)
      showPhoto: Boolean,
      links: [{ _id: false, label: String, url: String }],
      details: {
        dateOfBirth: String,
        nationality: String,
        visaStatus: String,
        drivingLicense: String,
      },
      showDetails: Boolean,
      // legacy fields, migrated into links by the client
      linkedin: String,
      github: String,
    },

    summary: String,

    education: [
      {
        institute: String,
        degree: String,
        fieldOfStudy: String,
        location: String,
        startYear: String,
        endYear: String,
        current: Boolean,
        grade: String,
        honors: String,
        coursework: String,
      },
    ],

    experience: [
      {
        company: String,
        position: String,
        location: String,
        type: String,
        startDate: String,
        endDate: String,
        current: Boolean,
        description: String,
      },
    ],

    // Strings (legacy) or { name, level, category }
    skills: [mongoose.Schema.Types.Mixed],

    projects: [
      {
        title: String,
        role: String,
        link: String,
        description: String,
      },
    ],

    // Strings (legacy) or { name, issuer, date, expiry, credentialId }
    certifications: [mongoose.Schema.Types.Mixed],

    languages: [{ _id: false, name: String, level: String }],
    volunteering: [{ role: String, organization: String, startDate: String, endDate: String, current: Boolean, description: String }],
    awards: [{ title: String, issuer: String, date: String, description: String }],
    courses: [{ name: String, institution: String, date: String }],
    publications: [{ title: String, publisher: String, date: String, url: String }],
    memberships: [{ name: String, role: String, startDate: String, endDate: String, current: Boolean }],
    interests: [String],
    references: {
      mode: { type: String, enum: ["request", "list"], default: "request" },
      items: [{ name: String, title: String, company: String, contact: String }],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Resume", resumeSchema);
