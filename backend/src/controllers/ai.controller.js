import { enhanceResume } from "../services/gemini.service.js";

export const enhanceResumeController =
  async (req, res) => {
    try {
      const enhanced =
        await enhanceResume(
          req.body
        );

      res.json({
        enhanced,
      });
    } catch (error) {
      console.log(error);

      const statusCode =
        error.status || 500;

      res.status(statusCode).json({
        message:
          statusCode === 503
            ? "AI service is busy. Please try again in a minute."
            : "AI enhancement failed",
      });
    }
  };
