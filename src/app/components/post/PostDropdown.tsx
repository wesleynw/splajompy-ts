import { usePosts } from "@/app/data/posts";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { TrashIcon } from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface PostDropdownProps {
  post_id: number;
}

export default function PostDropdown({ post_id }: Readonly<PostDropdownProps>) {
  const router = useRouter();
  const { deletePost } = usePosts();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleDelete = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(false);
    deletePost(post_id);
    if (pathname.includes(`post/${post_id}`)) {
      router.back();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleClick}
        className="rounded-full p-2 transition-colors hover:bg-neutral-800"
        aria-label="Post options"
      >
        <EllipsisVerticalIcon className="size-6 text-neutral-200" />
      </button>

      {isOpen && (
        <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-neutral-800 ring-1 shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={handleDelete}
              className="flex w-full items-center px-4 py-2 text-sm text-neutral-300 transition-all hover:bg-neutral-600"
              role="menuitem"
            >
              <TrashIcon className="mr-3 h-4 w-4" />
              Delete Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
