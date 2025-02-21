"use client";

import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export default function Navigation() {
  return (
    <>
      <div className="sm:hidden">
        <MobileNavigation />
      </div>
      <div className="hidden sm:block">
        <DesktopNavigation />
      </div>
    </>
  );
}
