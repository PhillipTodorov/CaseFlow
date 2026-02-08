import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAccessibility } from "../../context/AccessibilityContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import Button from "../ui/Button";

export default function Header() {
  const { settings, setTextScale, toggleHighContrast } = useAccessibility();
  const { canInstall, install } = usePWAInstall();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] flex items-center ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
    }`;

  return (
    <header className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="text-xl font-bold text-blue-400 flex items-center gap-2"
          >
            CaseFlow
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            <NavLink to="/intake" className={navLinkClass}>
              New Referral
            </NavLink>
            <NavLink to="/settings" className={navLinkClass}>
              Settings
            </NavLink>
          </nav>

          {/* Accessibility controls */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={() => setTextScale(settings.textScale - 0.1)}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:bg-slate-700 text-sm font-bold"
                aria-label="Decrease text size"
                disabled={settings.textScale <= 0.8}
              >
                A-
              </button>
              <button
                onClick={() => setTextScale(settings.textScale + 0.1)}
                className="w-8 h-8 flex items-center justify-center rounded text-slate-400 hover:bg-slate-700 text-base font-bold"
                aria-label="Increase text size"
                disabled={settings.textScale >= 1.5}
              >
                A+
              </button>
            </div>
            <button
              onClick={toggleHighContrast}
              className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
                settings.highContrast
                  ? "bg-white text-slate-900 border-white"
                  : "text-slate-400 border-slate-600 hover:bg-slate-700"
              }`}
              aria-pressed={settings.highContrast}
            >
              Contrast
            </button>
            {canInstall && (
              <Button variant="ghost" size="sm" onClick={install}>
                Install App
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-slate-400 hover:bg-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 space-y-1" aria-label="Main">
            <NavLink to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Dashboard
            </NavLink>
            <NavLink to="/intake" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              New Referral
            </NavLink>
            <NavLink to="/settings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Settings
            </NavLink>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-700 mt-2">
              <button
                onClick={() => setTextScale(settings.textScale - 0.1)}
                className="w-10 h-10 flex items-center justify-center rounded text-slate-400 hover:bg-slate-700 text-sm font-bold"
                aria-label="Decrease text size"
              >
                A-
              </button>
              <button
                onClick={() => setTextScale(settings.textScale + 0.1)}
                className="w-10 h-10 flex items-center justify-center rounded text-slate-400 hover:bg-slate-700 text-base font-bold"
                aria-label="Increase text size"
              >
                A+
              </button>
              <button
                onClick={toggleHighContrast}
                className={`px-3 py-2 rounded text-xs font-medium border ${
                  settings.highContrast
                    ? "bg-white text-slate-900 border-white"
                    : "text-slate-400 border-slate-600"
                }`}
                aria-pressed={settings.highContrast}
              >
                Contrast
              </button>
              {canInstall && (
                <Button variant="ghost" size="sm" onClick={install}>
                  Install
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
