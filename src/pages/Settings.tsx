import { useState, useRef } from "react";
import { useCases } from "../context/CaseContext";
import { useAccessibility } from "../context/AccessibilityContext";
import {
  exportToJSON,
  exportToCSV,
  importFromJSON,
  clearAllData,
  getStorageUsage,
  getCurrentUser,
  setCurrentUser,
} from "../utils/storage";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";

export default function Settings() {
  const { cases, dispatch } = useCases();
  const { settings, setTextScale, toggleHighContrast } = useAccessibility();

  const [userName, setUserName] = useState(getCurrentUser());
  const [showClearModal, setShowClearModal] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const storageUsage = getStorageUsage();

  const handleExportJSON = () => exportToJSON(cases);
  const handleExportCSV = () => exportToCSV(cases);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedCases = await importFromJSON(file);
      importedCases.forEach((c) => {
        dispatch({ type: "ADD_CASE", payload: c });
      });
      setImportStatus({
        type: "success",
        message: `Successfully imported ${importedCases.length} cases.`,
      });
    } catch {
      setImportStatus({
        type: "error",
        message: "Failed to import. Please check the file is valid JSON.",
      });
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClearAll = () => {
    clearAllData();
    dispatch({ type: "CLEAR_ALL" });
    setShowClearModal(false);
  };

  const handleUserNameChange = (name: string) => {
    setUserName(name);
    setCurrentUser(name);
  };

  return (
    <main id="main" className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-slate-100 mb-6">Settings</h1>

      {/* User Name */}
      <Card title="Your Name" className="mb-6">
        <p className="text-sm text-slate-400 mb-3">
          Used for the &quot;My Cases&quot; filter and when adding notes.
        </p>
        <input
          type="text"
          value={userName}
          onChange={(e) => handleUserNameChange(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-100 text-sm min-h-[44px]"
        />
      </Card>

      {/* Export */}
      <Card title="Export Data" className="mb-6">
        <p className="text-sm text-slate-400 mb-3">
          {cases.length} case{cases.length !== 1 ? "s" : ""} available for
          export.
        </p>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleExportCSV}
            disabled={cases.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            onClick={handleExportJSON}
            disabled={cases.length === 0}
          >
            Export JSON
          </Button>
        </div>
      </Card>

      {/* Import */}
      <Card title="Import Data" className="mb-6">
        <p className="text-sm text-slate-400 mb-3">
          Import cases from a previously exported JSON file.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-blue-600 file:text-white
            hover:file:bg-blue-700 file:cursor-pointer file:min-h-[44px]"
        />
        {importStatus && (
          <div className="mt-3">
            <Alert type={importStatus.type === "success" ? "success" : "error"}>
              {importStatus.message}
            </Alert>
          </div>
        )}
      </Card>

      {/* Storage Usage */}
      <Card title="Storage Usage" className="mb-6">
        <div className="mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-slate-300">
              {(storageUsage.used / 1024).toFixed(1)} KB used
            </span>
            <span className="text-slate-400">
              {(storageUsage.limit / 1024 / 1024).toFixed(0)} MB limit
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                storageUsage.percentage > 80
                  ? "bg-red-500"
                  : storageUsage.percentage > 50
                  ? "bg-amber-500"
                  : "bg-brand"
              }`}
              style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          {storageUsage.percentage}% of estimated storage used.
        </p>
      </Card>

      {/* Accessibility */}
      <Card title="Accessibility" className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Text Size: {Math.round(settings.textScale * 100)}%
            </label>
            <input
              type="range"
              min="0.8"
              max="1.5"
              step="0.1"
              value={settings.textScale}
              onChange={(e) => setTextScale(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Text size"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>80%</span>
              <span>100%</span>
              <span>150%</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">High Contrast</span>
            <button
              onClick={toggleHighContrast}
              role="switch"
              aria-checked={settings.highContrast}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.highContrast ? "bg-blue-600" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.highContrast ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Clear Data */}
      <Card title="Clear All Data" className="mb-6">
        <p className="text-sm text-slate-400 mb-3">
          Permanently delete all cases, drafts, and settings. This action
          cannot be undone.
        </p>
        <Button
          variant="danger"
          onClick={() => setShowClearModal(true)}
          disabled={cases.length === 0}
        >
          Clear All Data
        </Button>
      </Card>

      {/* Clear Confirmation Modal */}
      <Modal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        title="Clear All Data?"
        confirmLabel="Clear Everything"
        confirmVariant="danger"
        onConfirm={handleClearAll}
      >
        <p>
          This will permanently delete <strong>{cases.length} case(s)</strong>,
          all drafts, and all settings. This action cannot be undone.
        </p>
        <p className="mt-2">
          Consider exporting your data first.
        </p>
      </Modal>
    </main>
  );
}
