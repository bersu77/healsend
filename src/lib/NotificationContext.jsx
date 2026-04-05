"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
} from "react";
import AppIcon from "@/components/ui/AppIcon";

const NotificationContext = createContext(null);

let nextId = 1;

function reducer(state, action) {
  switch (action.type) {
    case "ADD":
      return [...state, action.notification];
    case "REMOVE":
      return state.filter((n) => n.id !== action.id);
    default:
      return state;
  }
}

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(reducer, []);

  const addNotification = useCallback(
    ({ title, message, type = "info", duration = 5000 }) => {
      const id = nextId++;
      dispatch({
        type: "ADD",
        notification: { id, title, message, type, timestamp: Date.now() },
      });
      if (duration > 0) {
        setTimeout(() => dispatch({ type: "REMOVE", id }), duration);
      }
      return id;
    },
    [],
  );

  const removeNotification = useCallback((id) => {
    dispatch({ type: "REMOVE", id });
  }, []);

  const notify = {
    success: (title, message) =>
      addNotification({ title, message, type: "success" }),
    error: (title, message) =>
      addNotification({ title, message, type: "error", duration: 8000 }),
    info: (title, message) => addNotification({ title, message, type: "info" }),
    warning: (title, message) =>
      addNotification({ title, message, type: "warning" }),
    payment: (title, message) =>
      addNotification({ title, message, type: "payment", duration: 8000 }),
    order: (title, message) =>
      addNotification({ title, message, type: "order", duration: 6000 }),
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, notify, removeNotification }}
    >
      {children}
      <NotificationToast
        notifications={notifications}
        onDismiss={removeNotification}
      />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error(
      "useNotifications must be used within NotificationProvider",
    );
  return ctx;
}

/* ═══════════ Toast Renderer ═══════════ */

const TYPE_CONFIG = {
  success: {
    icon: "check_circle",
    bg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-500",
  },
  error: {
    icon: "error",
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-500",
  },
  info: {
    icon: "info",
    bg: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-500",
  },
  warning: {
    icon: "warning",
    bg: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-500",
  },
  payment: {
    icon: "payments",
    bg: "bg-[#e5deff] border-[#5b3cdd]/20",
    iconColor: "text-[#5b3cdd]",
  },
  order: {
    icon: "shopping_bag",
    bg: "bg-emerald-50 border-emerald-200",
    iconColor: "text-emerald-500",
  },
};

function NotificationToast({ notifications, onDismiss }) {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
        return (
          <div
            key={n.id}
            className={`pointer-events-auto border rounded-xl p-4 shadow-lg animate-in slide-in-from-right duration-300 flex items-start gap-3 ${cfg.bg}`}
          >
            <AppIcon
              name={cfg.icon}
              className={`${cfg.iconColor} text-xl flex-shrink-0 mt-0.5`}
            />
            <div className="flex-1 min-w-0">
              {n.title && (
                <p className="font-semibold text-sm text-[#1c1a24]">
                  {n.title}
                </p>
              )}
              {n.message && (
                <p className="text-xs text-[#484555] mt-0.5 leading-relaxed">
                  {n.message}
                </p>
              )}
            </div>
            <button
              onClick={() => onDismiss(n.id)}
              className="text-[#797587] hover:text-[#1c1a24] flex-shrink-0"
            >
              <AppIcon name="close" className="text-lg" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
