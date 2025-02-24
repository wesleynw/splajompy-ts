import { Lightbulb as LightbulbIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";

export default function DownloadPrompt() {
  const [openModal, setOpenModal] = useState(false);
  const [isPWAEligible, setIsPWAEligible] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    setIsPWAEligible(!window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (!isPWAEligible) {
    return;
  }

  return (
    <div className="sm:hidden">
      <div className="ml-5 rounded-full border border-green-500 p-0.5">
        <button
          className="flex items-center p-0.5 focus:outline-none"
          onClick={handleOpenModal}
        >
          <LightbulbIcon className="h-5 w-5 text-green-500" />
          <p className="px-1 text-sm font-bold text-green-500">Install</p>
        </button>
      </div>

      {openModal && (
        <div className="fixed inset-0 top-15 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-sm">
          <button
            className="bg-opacity-50 fixed inset-0"
            onClick={handleCloseModal}
          />
          <div className="relative w-full max-w-md rounded-lg bg-neutral-800 p-6 shadow-xl backdrop-blur-xl">
            <h2 id="pwa-install-title" className="mb-4 text-xl font-semibold">
              Install Splajompy
            </h2>
            <p className="mb-6">
              On your phone, open browser share menu and tap &quot;Add to Home
              Screen&quot;.
            </p>
            <div className="text-right">
              <button
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 hover:text-neutral-800"
                onClick={handleCloseModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
