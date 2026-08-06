export type NavItemId =
  | "home"
  | "debrief"
  | "mission"
  | "evidence"
  | "review"
  | "settings";

export type NavItem = {
  id: NavItemId;
  label: string;
  href: string;
};

export const bottomNavItems: NavItem[] = [
  { id: "home", label: "Home", href: "/operations" },
  { id: "debrief", label: "Debrief", href: "/debrief" },
  { id: "mission", label: "Mission", href: "/mission" },
  { id: "evidence", label: "Evidence", href: "/evidence" },
  { id: "review", label: "Review", href: "/review" },
  { id: "settings", label: "Settings", href: "/settings" },
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.id === "home") {
    return pathname === "/operations" || pathname === "/dashboard";
  }

  if (item.id === "settings") {
    return (
      pathname === "/settings" ||
      pathname.startsWith("/settings/") ||
      pathname === "/about" ||
      pathname === "/philosophy" ||
      pathname === "/creed" ||
      pathname === "/privacy" ||
      pathname === "/terms"
    );
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
