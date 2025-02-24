import { usePosts } from "@/app/data/posts";
import {
  DotsThreeVertical as DotsThreeVerticalIcon,
  Trash as TrashIcon,
} from "@phosphor-icons/react/dist/ssr";
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
        <DotsThreeVerticalIcon size={23} />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-sm border-1 border-neutral-500 bg-neutral-800 shadow-lg">
          <div role="menu" aria-orientation="vertical">
            <button
              onClick={handleDelete}
              className="flex w-full items-center px-4 py-3 text-sm text-neutral-300 transition-all hover:bg-neutral-600"
              role="menuitem"
            >
              <TrashIcon className="mr-3" size={20} />
              Delete Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
