/**
 * Ícones em SVG desenhados à mão (traço com a cor do texto), sem biblioteca externa.
 * Todos são decorativos: quem usa o ícone coloca o texto ou o aria-label no botão.
 */
const PATHS = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  star: <path d="M12 3.2l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.2l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />,
  dice: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3.5" />
      <circle cx="8.6" cy="8.6" r="1.1" className="icon__dot" />
      <circle cx="15.4" cy="8.6" r="1.1" className="icon__dot" />
      <circle cx="12" cy="12" r="1.1" className="icon__dot" />
      <circle cx="8.6" cy="15.4" r="1.1" className="icon__dot" />
      <circle cx="15.4" cy="15.4" r="1.1" className="icon__dot" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
    </>
  ),
  power: (
    <>
      <path d="M12 3.5v8" />
      <path d="M7.2 6.6a7 7 0 1 0 9.6 0" />
    </>
  ),
  palette: (
    <>
      <path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.1 0 1.8-.7 1.8-1.6 0-1.1-.9-1.5-.9-2.5 0-.9.7-1.5 1.6-1.5h2.2a3.8 3.8 0 0 0 3.8-3.8c0-4.3-3.8-7.6-8.5-7.6z" />
      <circle cx="7.6" cy="11.4" r="1.15" className="icon__dot" />
      <circle cx="10.2" cy="7.4" r="1.15" className="icon__dot" />
      <circle cx="14.8" cy="7.6" r="1.15" className="icon__dot" />
    </>
  ),
  moon: <path d="M19.5 14.6A7.8 7.8 0 0 1 9.4 4.5a7.8 7.8 0 1 0 10.1 10.1z" />,
  chevronLeft: <path d="M14.5 5.5L8 12l6.5 6.5" />,
  chevronRight: <path d="M9.5 5.5L16 12l-6.5 6.5" />,
  arrowUp: <path d="M12 19V5M6.5 10.5L12 5l5.5 5.5" />,
  arrowDown: <path d="M12 5v14M6.5 13.5L12 19l5.5-5.5" />,
  signal: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4.5 4.5M8.5 8.5l5 5M13.5 8.5l-5 5" />
    </>
  ),
};

export default function Icon({ name, filled = false, className = "", size = 20 }) {
  return (
    <svg
      className={`icon ${filled ? "icon--filled" : ""} ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  );
}
