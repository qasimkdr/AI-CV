const fs = require("fs");
const path = require("path");

const structure = {
  src: {
    config: ["db.js", "gemini.js", "env.js"],
    models: ["User.js", "Resume.js"],
    controllers: [
      "auth.controller.js",
      "resume.controller.js",
      "ai.controller.js",
      "export.controller.js",
    ],
    services: [
      "auth.service.js",
      "resume.service.js",
      "gemini.service.js",
      "pdf.service.js",
      "docx.service.js",
    ],
    routes: [
      "auth.routes.js",
      "resume.routes.js",
      "ai.routes.js",
      "export.routes.js",
    ],
    middlewares: [
      "auth.middleware.js",
      "error.middleware.js",
      "validate.middleware.js",
    ],
    templates: {
      modern: {},
      executive: {},
      ats: {},
      corporate: {},
      creative: {},
    },
    utils: [
      "generateToken.js",
      "formatResumeData.js",
      "responseHandler.js",
    ],
  },
};

function createStructure(base, obj) {
  for (const key in obj) {
    const value = obj[key];
    const currentPath = path.join(base, key);

    if (Array.isArray(value)) {
      fs.mkdirSync(currentPath, { recursive: true });
      value.forEach((file) => {
        fs.writeFileSync(path.join(currentPath, file), "");
      });
    } else if (typeof value === "object") {
      fs.mkdirSync(currentPath, { recursive: true });
      createStructure(currentPath, value);
    }
  }
}

createStructure(".", structure);

console.log("Backend structure created successfully 🚀");