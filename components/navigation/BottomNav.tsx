"use client";

import { usePathname } from "next/navigation";
import {
  bottomNavItems,
  isNavItemActive,
  type NavItem,
} from "@/lib/navigation";
import { BottomNavItem } from "@/components/navigation/BottomNavItem";

type BottomNavProps = {
  items?: NavItem[];
};

export function BottomNav({ items = bottomNavItems }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 sm:max-w-2xl lg:max-w-3xl">
        {items.map((item) => (
          <BottomNavItem
            key={item.id}
            item={item}
            active={isNavItemActive(pathname, item)}
          />
        ))}
      </div>
    </nav>
  );
}
