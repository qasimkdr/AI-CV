// Counts consecutive days the user opened the dashboard (stored per browser).
const KEY = "aicv:streak";

const day = (d = new Date()) => d.toISOString().slice(0, 10);

export function touchStreak() {
  try {
    const today = day();
    const yesterday = day(new Date(Date.now() - 86400000));
    const saved = JSON.parse(localStorage.getItem(KEY) || "null");

    let next;
    if (!saved) next = { last: today, count: 1, best: 1 };
    else if (saved.last === today) next = saved;
    else if (saved.last === yesterday) {
      const count = saved.count + 1;
      next = { last: today, count, best: Math.max(saved.best || 1, count) };
    } else next = { last: today, count: 1, best: saved.best || 1 };

    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  } catch {
    return { last: day(), count: 1, best: 1 };
  }
}
