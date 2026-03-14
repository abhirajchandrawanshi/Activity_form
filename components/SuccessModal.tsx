"use client";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* X close button — top right, exactly as in Figma */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Large checkmark icon - matches Frame 1051 exactly */}
        <div className="modal-icon-wrap">
          <div className="check-outer">
            <div className="check-inner">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M5 12L10 17L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* "Form Submitted" text */}
        <h2 className="modal-title">Form Submitted</h2>
      </div>
    </div>
  );
}
