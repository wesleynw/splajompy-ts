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

export default function DesktopNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: <HouseIcon size={23} />,
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: (
        <NotificationBadge>
          <BellIcon size={23} />
        </NotificationBadge>
      ),
    },
    {
      label: "All",
      href: "/all",
      icon: <GlobeIcon size={23} />,
    },
    {
      label: "Search",
      href: "/search",
      icon: <MagnifyingGlassIcon className="h-6 w-6" />,
    },
    {
      label: "Profile",
      href: `/user/${user.username}`,
      icon: <UserCircleIcon size={23} />,
    },
  ];

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

  return (
    <nav className="fixed top-0 left-0 h-full bg-transparent pl-12">
      <div className="h-16" />
      <div className="overflow-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.label}>
                <button
                  onClick={(event) => handleNavigation(event, item.href)}
                  className={`flex min-h-12 w-full items-center gap-4 rounded-full border-2 border-transparent px-4 py-3 transition-colors duration-300 outline-none ${isActive ? "bg-neutral-800" : "bg-transparent hover:bg-neutral-700"} `}
                >
                  <span className="text-white">{item.icon}</span>
                  <span className="text-lg text-white">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
