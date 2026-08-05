import Link from "next/link";
import type { NavItem } from "@/lib/navigation";
import { NavIcon } from "@/components/navigation/NavIcon";

type BottomNavItemProps = {
  item: NavItem;
  active: boolean;
};

export function BottomNavItem({ item, active }: BottomNavItemProps) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-1"
    >
      <span
        className={`mb-0.5 h-0.5 w-4 rounded-full ${
          active ? "bg-accent" : "bg-transparent"
        }`}
      />
      <NavIcon id={item.id} active={active} />
      <span
        className={`truncate text-[10px] font-medium tracking-wide ${
          active ? "text-accent" : "text-muted"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}
