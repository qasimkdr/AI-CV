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

import { SECTION_TITLES, SKILL_GROUP_LABELS, contactItems, normalizeResume, toBullets } from "../components/templates/resumeData";

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

  if (r.personal.details.length) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [new TextRun({ text: r.personal.details.map((d) => `${d.label}: ${d.value}`).join("  |  "), size: 18, color: "555B70", font: FONT })],
      })
    );
  }

  const plain = (text, opts = {}) => new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text, size: 21, font: FONT, ...opts })] });

  const entries = (items, { withDesc = true } = {}) => {
    items.forEach((e) => {
      children.push(titleLine(e.title || e.org, e.date));
      const sub = [e.title && e.org ? e.org : "", e.location, e.type].filter(Boolean).join(" · ");
      if (sub) children.push(subLine(sub));
      if (e.meta) children.push(plain(e.meta, { color: "555B70", size: 19 }));
      if (withDesc && e.description) children.push(...descriptionParagraphs(e.description));
    });
  };

  const TITLES = { ...SECTION_TITLES, summary: "Professional Summary" };

  r.order.forEach((id) => {
    children.push(sectionHeading(TITLES[id]));
    switch (id) {
      case "summary":
        children.push(...descriptionParagraphs(r.summary));
        break;
      case "education":
        r.education.forEach((e) => {
          children.push(titleLine(e.title || e.org, e.date));
          const sub = [e.title && e.org ? e.org : "", e.location].filter(Boolean).join(" · ");
          if (sub) children.push(subLine(sub));
          if (e.grade || e.honors) children.push(plain([e.grade, e.honors].filter(Boolean).join(" · ")));
          if (e.description) children.push(plain(e.description));
        });
        break;
      case "projects":
        r.projects.forEach((p) => {
          children.push(titleLine([p.title, p.role].filter(Boolean).join(" — ")));
          if (p.link) children.push(plain(p.link, { color: "4B3FD9", size: 19 }));
          children.push(...descriptionParagraphs(p.description));
        });
        break;
      case "skills": {
        const groups = r.skills.reduce((acc, s) => ((acc[s.category] ||= []).push(s), acc), {});
        const keys = Object.keys(groups);
        keys.forEach((k) => {
          const text = groups[k].map((s) => (s.level ? `${s.name} (${s.level})` : s.name)).join(" • ");
          children.push(
            keys.length > 1
              ? new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: `${SKILL_GROUP_LABELS[k] || k}: `, bold: true, size: 21, font: FONT }), new TextRun({ text, size: 21, font: FONT })] })
              : plain(text)
          );
        });
        break;
      }
      case "languages":
        children.push(plain(r.languages.map((l) => (l.level ? `${l.name} (${l.level})` : l.name)).join(" • ")));
        break;
      case "interests":
        children.push(plain(r.interests.join(" • ")));
        break;
      case "references":
        if (r.references.mode === "request" || !r.references.items.length) children.push(plain("Available upon request.", { italics: true }));
        else
          r.references.items.forEach((x) => {
            children.push(titleLine(x.name));
            if (x.title) children.push(subLine(x.title));
            if (x.contact) children.push(plain(x.contact, { size: 19 }));
          });
        break;
      case "publications":
        r.publications.forEach((p) => {
          children.push(titleLine(p.title, p.date));
          if (p.org) children.push(subLine(p.org));
          if (p.link) children.push(plain(p.link, { color: "4B3FD9", size: 19 }));
        });
        break;
      case "certifications":
      case "courses":
      case "memberships":
        entries(r[id], { withDesc: false });
        break;
      default:
        entries(r[id] || []);
    }
  });


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
