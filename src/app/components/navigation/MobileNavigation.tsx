"use client";

import { useUser } from "@/app/providers/UserProvider";
import {
  Bell as BellIcon,
  Globe as GlobeIcon,
  House as HouseIcon,
  MagnifyingGlass as MagnifyingGlassIcon,
  UserCircle as UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { usePathname, useRouter } from "next/navigation";
import NotificationBadge from "../notifications/NotificationBadge";

export default function MobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const handleNavigation = (
    event: React.MouseEvent<HTMLButtonElement>,
    targetPath: string,
  ) => {
    if (targetPath === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(targetPath);
    }
  };

  const navItems = [
    {
      href: "/",
      icon: (
        <HouseIcon
          size={23}
          weight={`${pathname === "/" ? "fill" : "regular"}`}
        />
      ),
    },
    {
      href: "/notifications",
      icon: (
        <NotificationBadge>
          <BellIcon
            size={23}
            weight={`${pathname === "/notifications" ? "fill" : "regular"}`}
          />
        </NotificationBadge>
      ),
    },
    {
      href: "/all",
      icon: (
        <GlobeIcon
          size={23}
          weight={`${pathname === "/all" ? "fill" : "regular"}`}
        />
      ),
    },
    {
      href: "/search",
      icon: (
        <MagnifyingGlassIcon
          size={23}
          weight={`${pathname === "/search" ? "fill" : "regular"}`}
        />
      ),
    },
    {
      href: `/user/${user.username}`,
      icon: (
        <UserCircleIcon
          size={23}
          weight={pathname === `/user/${user.username}` ? "fill" : "regular"}
        />
      ),
    },
  ];

  return (
    <div className="fixed right-0 bottom-0 left-0 z-10 w-full">
      <nav className="flex h-14 w-full flex-row items-start justify-between bg-neutral-900 [@media(display-mode:standalone)]:h-20">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={(event) => handleNavigation(event, item.href)}
            className={`flex flex-1 items-center justify-center pt-4 text-white`}
          >
            {item.icon}
          </button>
        ))}
      </nav>
    </div>
  );
}
