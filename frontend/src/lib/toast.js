// Tiny event-based toast system — call toast.success("…") from anywhere.
export const TOAST_EVENT = "aicv:toast";

const emit = (type, message) =>
  window.dispatchEvent(
    new CustomEvent(TOAST_EVENT, {
      detail: { id: Date.now() + Math.random(), type, message },
    })
  );

export const toast = {
  success: (m) => emit("success", m),
  error: (m) => emit("error", m),
  info: (m) => emit("info", m),
};
