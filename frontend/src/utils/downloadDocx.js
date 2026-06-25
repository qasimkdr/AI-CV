import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";

import { saveAs } from "file-saver";

export const downloadDocx = async (
  resume
) => {
  const doc =
    new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text:
                resume.personalInfo
                  ?.fullName || "",
              heading:
                HeadingLevel.TITLE,
            }),

            new Paragraph(
              resume.personalInfo
                ?.email || ""
            ),

            new Paragraph(
              resume.personalInfo
                ?.phone || ""
            ),

            new Paragraph(
              resume.personalInfo
                ?.address || ""
            ),

            new Paragraph({
              text: "",
            }),

            new Paragraph({
              text: "Skills",
              heading:
                HeadingLevel.HEADING_1,
            }),

            ...resume.skills.map(
              (skill) =>
                new Paragraph({
                  children: [
                    new TextRun(
                      `• ${skill}`
                    ),
                  ],
                })
            ),

            new Paragraph({
              text: "",
            }),

            new Paragraph({
              text: "Experience",
              heading:
                HeadingLevel.HEADING_1,
            }),

            ...resume.experience.flatMap(
              (exp) => [
                new Paragraph({
                  text:
                    exp.position,
                  heading:
                    HeadingLevel.HEADING_2,
                }),

                new Paragraph(
                  exp.company
                ),

                new Paragraph(
                  exp.description
                ),
              ]
            ),

            new Paragraph({
              text: "",
            }),

            new Paragraph({
              text: "Education",
              heading:
                HeadingLevel.HEADING_1,
            }),

            ...resume.education.flatMap(
              (edu) => [
                new Paragraph({
                  text:
                    edu.degree,
                  heading:
                    HeadingLevel.HEADING_2,
                }),

                new Paragraph(
                  edu.institute
                ),

                new Paragraph(
                  `${edu.startYear} - ${edu.endYear}`
                ),
              ]
            ),

            new Paragraph({
              text: "",
            }),

            new Paragraph({
              text: "Projects",
              heading:
                HeadingLevel.HEADING_1,
            }),

            ...resume.projects.flatMap(
              (
                project
              ) => [
                new Paragraph({
                  text:
                    project.title,
                  heading:
                    HeadingLevel.HEADING_2,
                }),

                new Paragraph(
                  project.description
                ),
              ]
            ),

            new Paragraph({
              text: "",
            }),

            new Paragraph({
              text:
                "Certifications",
              heading:
                HeadingLevel.HEADING_1,
            }),

            ...resume.certifications.map(
              (cert) =>
                new Paragraph(
                  cert
                )
            ),
          ],
        },
      ],
    });

  const blob =
    await Packer.toBlob(doc);

  saveAs(
    blob,
    `${
      resume.personalInfo
        ?.fullName
    } Resume.docx`
  );
};