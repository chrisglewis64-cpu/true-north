export type NavItemId = "home" | "debrief" | "mission" | "evidence" | "review";

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
];

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.id === "home") {
    return pathname === "/operations" || pathname === "/dashboard";
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}
