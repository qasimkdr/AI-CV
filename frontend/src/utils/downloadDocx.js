import {
  AlignmentType,
  BorderStyle,
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import { saveAs } from "file-saver";

import { contactItems, dateRange, normalizeResume, toBullets } from "../components/templates/resumeData";

// ATS-friendly Word export: single column, real headings, real bullets,
// right-aligned dates and only the sections that have content.
const FONT = "Calibri";
const ACCENT = "4B3FD9";

const sectionHeading = (text) =>
  new Paragraph({
    spacing: { before: 280, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "BFC3D9", space: 2 } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: ACCENT, font: FONT, characterSpacing: 40 })],
  });

const titleLine = (left, right, { bold = true } = {}) =>
  new Paragraph({
    spacing: { before: 120, after: 20 },
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: left, bold, size: 22, font: FONT }),
      ...(right ? [new TextRun({ text: `\t${right}`, size: 20, color: "555B70", font: FONT })] : []),
    ],
  });

const subLine = (text) =>
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, italics: true, size: 21, color: "3B4058", font: FONT })],
  });

const descriptionParagraphs = (text) => {
  const items = toBullets(text);
  if (items.length <= 1) {
    return items.map((t) => new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: t, size: 21, font: FONT })] }));
  }
  return items.map(
    (t) =>
      new Paragraph({
        bullet: { level: 0 },
        spacing: { after: 40 },
        children: [new TextRun({ text: t, size: 21, font: FONT })],
      })
  );
};

export const downloadDocx = async (resume) => {
  const r = normalizeResume(resume);
  const children = [];

  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: r.personal.fullName || "Resume", bold: true, size: 44, font: FONT })],
    })
  );

  if (r.personal.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [new TextRun({ text: r.personal.title, size: 24, color: ACCENT, font: FONT })],
      })
    );
  }

  const contacts = contactItems(r.personal);
  if (contacts.length) {
    const runs = [];
    contacts.forEach((c, i) => {
      if (i > 0) runs.push(new TextRun({ text: "  |  ", size: 19, color: "8A8FA3", font: FONT }));
      const run = new TextRun({ text: c.label, size: 19, font: FONT, ...(c.href && c.key !== "phone" ? { style: "Hyperlink" } : {}) });
      runs.push(c.href && c.key !== "phone" ? new ExternalHyperlink({ link: c.href, children: [run] }) : run);
    });
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: runs }));
  }

  if (r.summary) {
    children.push(sectionHeading("Professional Summary"), ...descriptionParagraphs(r.summary));
  }

  if (r.experience.length) {
    children.push(sectionHeading("Experience"));
    r.experience.forEach((e) => {
      children.push(titleLine(e.position || e.company, dateRange(e.startDate, e.endDate)));
      if (e.position && e.company) children.push(subLine(e.company));
      children.push(...descriptionParagraphs(e.description));
    });
  }

  if (r.projects.length) {
    children.push(sectionHeading("Projects"));
    r.projects.forEach((p) => {
      if (p.title) children.push(titleLine(p.title));
      children.push(...descriptionParagraphs(p.description));
    });
  }

  if (r.education.length) {
    children.push(sectionHeading("Education"));
    r.education.forEach((e) => {
      children.push(titleLine(e.degree || e.institute, dateRange(e.startYear, e.endYear)));
      if (e.degree && e.institute) children.push(subLine(e.institute));
    });
  }

  if (r.skills.length) {
    children.push(
      sectionHeading("Skills"),
      new Paragraph({ children: [new TextRun({ text: r.skills.join(" • "), size: 21, font: FONT })] })
    );
  }

  if (r.certifications.length) {
    children.push(sectionHeading("Certifications"));
    r.certifications.forEach((c) =>
      children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 40 }, children: [new TextRun({ text: c, size: 21, font: FONT })] }))
    );
  }

  const doc = new Document({
    creator: "AI CV",
    title: `${r.personal.fullName || "Resume"} — Resume`,
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    sections: [
      {
        properties: { page: { margin: { top: 900, bottom: 900, left: 1000, right: 1000 } } },
        children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const safeName = (r.personal.fullName || "Resume").replace(/[\\/:*?"<>|]+/g, "").trim() || "Resume";
  saveAs(blob, `${safeName} - Resume.docx`);
};
