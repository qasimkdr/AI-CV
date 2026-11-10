// Turns any API/network error into a short, human message (+ field details).
export function friendlyError(error, fallback = "Something went wrong. Please try again.") {
  const res = error?.response;
  if (!res) {
    return { message: "Can't reach the server right now. Check your internet connection and try again — your work is kept on this page.", fields: [] };
  }
  const data = res.data || {};
  const fields = Array.isArray(data.fields) ? data.fields : [];
  if (res.status === 413) return { message: "That's too large to save — try a smaller photo.", fields };
  if (res.status === 503) return { message: data.message || "The server is waking up or busy. Please try again in a few seconds.", fields };
  if (res.status >= 500) return { message: "The server had a problem saving this. Please try again in a moment.", fields };
  let message = typeof data.message === "string" ? data.message : fallback;
  // Never show raw database dumps to users.
  if (/Cast to|validation failed|Proxy\(|at path/i.test(message)) message = "Some details couldn't be saved. Please check the highlighted items.";
  return { message: message.length > 220 ? `${message.slice(0, 217)}…` : message, fields };
}
