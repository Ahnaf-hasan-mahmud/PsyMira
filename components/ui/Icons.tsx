/* ============================================================
   Consistent stroke-icon set (1.8 stroke, rounded).
   SVG only — never emoji. Inherits color via currentColor.
   ============================================================ */
type IconProps = {
  size?: number;
  className?: string;
};

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const ArrowRight = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Sparkle = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
  </svg>
);

export const Play = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);

export const Book = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5V5.5Z" />
    <path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20" />
  </svg>
);

export const Chart = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 20V10M10 20V4M16 20v-7M21 20H3" />
  </svg>
);

export const Seed = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 21v-7M12 14c0-3 2-5 6-5-1 4-3 6-6 5ZM12 14c0-3-2-5-6-5 1 4 3 6 6 5Z" />
  </svg>
);

export const Feather = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M20 4C11 5 7 9 5 16l3 3c7-2 11-6 12-15ZM5 19l5-5M9 13h4" />
  </svg>
);

export const Grid = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </svg>
);

export const Compass = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z" />
  </svg>
);

export const Bell = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8ZM10.3 21a2 2 0 0 0 3.4 0" />
  </svg>
);

export const Search = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </svg>
);

export const Logout = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

export const Flame = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M12 3c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3 2-4 .5 1 1.5 1.5 2 1 0-2-.5-4 2-7Z" />
  </svg>
);

export const Trophy = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4ZM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 18h6M10 21h4M12 15v3" />
  </svg>
);

export const Eye = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOff = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 3l18 18M10.6 10.7a3 3 0 0 0 4.2 4.2M9.4 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.1 3.9M6.1 6.2A17 17 0 0 0 2 12s3.5 7 10 7a10 10 0 0 0 2.6-.3" />
  </svg>
);

export const Check = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);

export const Star = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3.2l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.5l6-.7L12 3.2Z" />
  </svg>
);

export const Pause = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M8 5v14M16 5v14" />
  </svg>
);

export const Stop = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor" stroke="none" />
  </svg>
);

export const Restart = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7M3 4v4h4" />
  </svg>
);

export const Wind = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M3 8h11a3 3 0 1 0-3-3M3 16h14a3 3 0 1 1-3 3M3 12h17" />
  </svg>
);

export const Menu = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = ({ size = 22, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Google = ({ size = 18, className }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    className={className}
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M22.5 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-2 3.2-4.9 3.2-7.8Z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.3 1.1-3.6 1.1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z"
    />
    <path
      fill="#FBBC05"
      d="M6 14.4a6.6 6.6 0 0 1 0-4.2V7.4H2.3a11 11 0 0 0 0 9.8L6 14.4Z"
    />
    <path
      fill="#EA4335"
      d="M12 5.5c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 2.3 7.4L6 10.2c.9-2.5 3.2-4.7 6-4.7Z"
    />
  </svg>
);

/* ---- Relaxation module icons ---- */
export const Waves = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M2 7c1.6 0 1.6-1.6 3.2-1.6S6.8 7 8.4 7 10 5.4 11.6 5.4 13.2 7 14.8 7s1.6-1.6 3.2-1.6S19.6 7 22 7" />
    <path d="M2 12c1.6 0 1.6-1.6 3.2-1.6S6.8 12 8.4 12 10 10.4 11.6 10.4 13.2 12 14.8 12s1.6-1.6 3.2-1.6S19.6 12 22 12" />
    <path d="M2 17c1.6 0 1.6-1.6 3.2-1.6S6.8 17 8.4 17 10 15.4 11.6 15.4 13.2 17 14.8 17s1.6-1.6 3.2-1.6S19.6 17 22 17" />
  </svg>
);

export const Heart = ({
  size = 18,
  className,
  filled = false,
}: IconProps & { filled?: boolean }) => (
  <svg
    {...base(size)}
    className={className}
    fill={filled ? "currentColor" : "none"}
    aria-hidden="true"
  >
    <path d="M12 20.5s-7.2-4.4-9.3-8.7C1.2 8.6 2.9 5.2 6.2 5.2c2 0 3.3 1.2 4 2.3.7-1.1 2-2.3 4-2.3 3.3 0 5 3.4 3.5 6.6-2.1 4.3-9.3 8.7-9.3 8.7Z" />
  </svg>
);

export const Volume = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 9v6h3.5L13 20V4L7.5 9H4Z" />
    <path d="M16.5 8.5a5 5 0 0 1 0 7" />
    <path d="M19 6a8 8 0 0 1 0 12" />
  </svg>
);

export const VolumeMute = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 9v6h3.5L13 20V4L7.5 9H4Z" />
    <path d="m17 9 5 6M22 9l-5 6" />
  </svg>
);

export const Clock = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Headphones = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 13a8 8 0 0 1 16 0" />
    <path d="M4 13v3.5A2.5 2.5 0 0 0 6.5 19H7a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4Z" />
    <path d="M20 13v3.5a2.5 2.5 0 0 1-2.5 2.5H17a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3Z" />
  </svg>
);

export const Leaf = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M4 20c0-9 6-15 16-15 0 10-6 15-15 15" />
    <path d="M4 20c3-6 7-9 12-11" />
  </svg>
);

export const Moon = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export const Gamepad = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M6 11h4M8 9v4" />
    <line x1="15" y1="12" x2="15.01" y2="12" />
    <line x1="18" y1="10" x2="18.01" y2="10" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
);

export const Lightbulb = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.2 4.16-3 5.2V17a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-2.8C7.2 13.16 6 11.22 6 9a6 6 0 0 1 6-6z" />
  </svg>
);

export const AlertTriangle = ({ size = 18, className }: IconProps) => (
  <svg {...base(size)} className={className} aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);
