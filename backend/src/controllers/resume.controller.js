import Resume from "../models/Resume.js";

export const createResume = async (
  req,
  res
) => {
  try {
    const existingResumes =
      await Resume.find({
        userId: req.user.id,
      }).sort({
        createdAt: 1,
      });

    if (
      existingResumes.length >= 3
    ) {
      await Resume.findByIdAndDelete(
        existingResumes[0]._id
      );
    }

    const resume =
      await Resume.create({
        ...req.body,
        userId: req.user.id,
      });

    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyResumes =
  async (req, res) => {
    try {
      const resumes =
        await Resume.find({
          userId: req.user.id,
        }).sort({
          createdAt: -1,
        });

      res.json(resumes);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const getResume =
  async (req, res) => {
    try {
      const resume =
        await Resume.findOne({
          _id: req.params.id,
          userId: req.user.id,
        });

      if (!resume) {
        return res
          .status(404)
          .json({
            message:
              "Resume not found",
          });
      }

      res.json(resume);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const updateResume =
  async (req, res) => {
    try {
      const resume =
        await Resume.findOneAndUpdate(
          {
            _id: req.params.id,
            userId: req.user.id,
          },
          req.body,
          {
            new: true,
          }
        );

      if (!resume) {
        return res
          .status(404)
          .json({
            message:
              "Resume not found",
          });
      }

      res.json(resume);
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };

export const deleteResume =
  async (req, res) => {
    try {
      const resume =
        await Resume.findOneAndDelete(
          {
            _id: req.params.id,
            userId: req.user.id,
          }
        );

      if (!resume) {
        return res
          .status(404)
          .json({
            message:
              "Resume not found",
          });
      }

      res.json({
        message:
          "Resume deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  };