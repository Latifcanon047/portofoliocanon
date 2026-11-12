// Muncul hanya di HP portrait (lebar < 768px), hilang otomatis saat HP
// dimiringkan. CSS murni: tanpa JS, tanpa sensor.
export default function RotateHint() {
  return (
    <div
      role="status"
      className="fixed inset-0 z-50 hidden touch-none flex-col items-center justify-center gap-6 bg-black px-8 text-center max-md:portrait:flex"
    >
      <svg
        className="rotate-hint-icon h-24 w-24 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <path d="M11 18.5h2" />
      </svg>
      <p className="text-xl font-bold text-white">Miringkan HP-mu</p>
      <p className="max-w-xs text-sm text-white/80">
        Situs ini dirancang untuk layar lebar. Putar HP ke mode lanskap.
      </p>
    </div>
  );
}
