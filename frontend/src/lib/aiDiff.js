// Diff/merge helpers for reviewing AI suggestions.

const norm = (v) => (typeof v === "string" ? v.trim() : "");
const skillNames = (list = []) => list.map((s) => (typeof s === "string" ? s : s?.name)).filter(Boolean);

/** Builds the list of AI changes that differ from the original. */
export function diffResume(original, enhanced) {
  const items = [];
  if (norm(enhanced.summary) && norm(enhanced.summary) !== norm(original.summary)) {
    items.push({ key: "summary", label: "Professional summary", before: original.summary || "", after: enhanced.summary });
  }
  const lists = [
    ["experience", "Experience", (e) => [e.position, e.company].filter(Boolean).join(" · ")],
    ["projects", "Project", (p) => p.title],
    ["volunteering", "Volunteering", (v) => [v.role, v.organization].filter(Boolean).join(" · ")],
  ];
  lists.forEach(([key, label, titleOf]) => {
    (original[key] || []).forEach((item, i) => {
      const after = enhanced[key]?.[i]?.description;
      if (norm(after) && norm(after) !== norm(item.description)) {
        items.push({ key: `${key}.${i}`, label: `${label}: ${titleOf(item) || `#${i + 1}`}`, before: item.description || "", after });
      }
    });
  });
  const a = skillNames(original.skills);
  const b = skillNames(enhanced.skills);
  if (b.length && b.join("|").toLowerCase() !== a.join("|").toLowerCase()) {
    items.push({ key: "skills", label: "Skills", before: a, after: b, kind: "skills" });
  }
  return items;
}

/** Applies the accepted changes on top of the original resume. */
export function applyChanges(original, enhanced, accepted) {
  const next = structuredClone(original);
  accepted.forEach((key) => {
    if (key === "summary") next.summary = enhanced.summary;
    else if (key === "skills") next.skills = enhanced.skills;
    else {
      const [list, i] = key.split(".");
      if (next[list]?.[i]) next[list][i] = { ...next[list][i], description: enhanced[list][i].description };
    }
  });
  return next;
}
