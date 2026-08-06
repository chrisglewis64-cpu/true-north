import type { NavItemId } from "@/lib/navigation";

type NavIconProps = {
  id: NavItemId;
  active: boolean;
};

export function NavIcon({ id, active }: NavIconProps) {
  const stroke = active ? "var(--accent)" : "var(--muted)";

  switch (id) {
    case "home":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.5" />
          <circle cx="12" cy="12" r="2.5" fill={stroke} />
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "debrief":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="4"
            y="3"
            width="16"
            height="18"
            rx="2"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M8 8h8M8 12h8M8 16h5"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
    case "mission":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3L4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 8v8M9 11l3-3 3 3"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "evidence":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke={stroke}
            strokeWidth="1.5"
          />
          <path
            d="M8 12l3 3 5-6"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "review":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 4a8 8 0 1 0 8 8"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M12 4v4l2.5 2.5M20 4v4h-4"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.5" />
          <path
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4l1.4-1.4M17 7l1.4-1.4"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}
