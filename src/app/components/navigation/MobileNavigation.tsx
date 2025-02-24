"use client";

import { useUser } from "@/app/providers/UserProvider";
import {
  BellIcon,
  GlobeAltIcon,
  HomeIcon,
  MagnifyingGlassCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import {
  BellIcon as BellSolidIcon,
  GlobeAltIcon as GlobeAltSolidIcon,
  HomeIcon as HomeSolidIcon,
  MagnifyingGlassCircleIcon as MagnifyingGlassSolidCircleIcon,
  UserIcon as UserSolidIcon,
} from "@heroicons/react/24/solid";
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
      icon:
        pathname === "/" ? (
          <HomeSolidIcon className="h-6 w-6 [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.9))]" />
        ) : (
          <HomeIcon className="h-6 w-6" />
        ),
    },
    {
      href: "/notifications",
      icon: (
        <NotificationBadge>
          {pathname === "/notifications" ? (
            <BellSolidIcon className="h-6 w-6 [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.9))]" />
          ) : (
            <BellIcon className="h-6 w-6" />
          )}
        </NotificationBadge>
      ),
    },
    {
      href: "/all",
      icon:
        pathname === "/all" ? (
          <GlobeAltSolidIcon className="h-6 w-6 [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.9))]" />
        ) : (
          <GlobeAltIcon className="h-6 w-6" />
        ),
    },
    {
      href: "/search",
      icon:
        pathname === "/search" ? (
          <MagnifyingGlassSolidCircleIcon className="h-6 w-6 [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.9))]" />
        ) : (
          <MagnifyingGlassCircleIcon className="h-6 w-6" />
        ),
    },
    {
      href: `/user/${user.username}`,
      icon:
        pathname === `/user/${user.username}` ? (
          <UserSolidIcon className="h-6 w-6 [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.9))]" />
        ) : (
          <UserIcon className="h-6 w-6" />
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
