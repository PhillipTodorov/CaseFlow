import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { AccessibilitySettings } from "../types";

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  setTextScale: (scale: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const defaultSettings: AccessibilitySettings = {
  textScale: 1,
  highContrast: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | null>(
  null
);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useLocalStorage<AccessibilitySettings>(
    "caseflow_settings",
    defaultSettings
  );

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--text-scale",
      String(settings.textScale)
    );
    document.documentElement.classList.toggle(
      "high-contrast",
      settings.highContrast
    );
  }, [settings]);

  const setTextScale = (scale: number) => {
    const clamped = Math.max(0.8, Math.min(1.5, scale));
    setSettings((prev) => ({ ...prev, textScale: clamped }));
  };

  const toggleHighContrast = () => {
    setSettings((prev) => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReducedMotion = () => {
    setSettings((prev) => ({
      ...prev,
      reducedMotion: !prev.reducedMotion,
    }));
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, setTextScale, toggleHighContrast, toggleReducedMotion }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context)
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  return context;
}
