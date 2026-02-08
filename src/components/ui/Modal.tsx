import { useEffect, useRef, type ReactNode } from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm?: () => void;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel,
  confirmVariant = "primary",
  onConfirm,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => onClose();
    dialog.addEventListener("close", handleClose);
    return () => dialog.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg shadow-xl p-0 max-w-md w-full bg-slate-800 border border-slate-700 backdrop:bg-black/70"
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-slate-100 mb-4">{title}</h2>
        <div className="text-sm text-slate-300 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {onConfirm && (
            <Button variant={confirmVariant} onClick={onConfirm}>
              {confirmLabel || "Confirm"}
            </Button>
          )}
        </div>
      </div>
    </dialog>
  );
}
