import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

const ToastContext = createContext(null);

let toastId = 0;

const typeStyles = {
  success:
    "bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success)]",
  error:
    "bg-[var(--color-danger-light)] text-[var(--color-danger)] border-[var(--color-danger)]",
  info: "bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]",
};

const typeIcons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const remove = useCallback((id) => {
    clearTimeout(timersRef.current[id]);
    delete timersRef.current[id];
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);
      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => remove(id), duration);
      }
      return id;
    },
    [remove],
  );

  const toast = useMemo(
    () => ({
      success: (msg, dur) => add(msg, "success", dur),
      error: (msg, dur) => add(msg, "error", dur),
      info: (msg, dur) => add(msg, "info", dur),
    }),
    [add],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={`flex items-start gap-3 rounded-[var(--radius-sm)] border-l-4 px-4 py-3 text-sm font-medium shadow-lg transition-all ${typeStyles[t.type] || typeStyles.info}`}
            style={{ boxShadow: "var(--shadow-card-hover)" }}
          >
            <span className="mt-0.5 shrink-0 text-base font-bold">
              {typeIcons[t.type] || typeIcons.info}
            </span>
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 text-current opacity-60 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
