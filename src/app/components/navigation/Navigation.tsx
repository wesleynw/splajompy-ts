"use client";

import DesktopNavigation from "./DesktopNavigation";
import MobileNavigation from "./MobileNavigation";

export default function Navigation() {
  return (
    <>
      <div className="xl:hidden">
        <MobileNavigation />
      </div>
      <div className="hidden xl:block">
        <DesktopNavigation />
      </div>
    </>
  );
}
