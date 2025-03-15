import { PlusCircle as PlusCircleIcon } from "@phosphor-icons/react/dist/ssr";
import Button from "../../button/Button";

type Props = {
  isOpen: boolean;
  toggleOpen: () => void;
};

export default function NewPostButton({ isOpen, toggleOpen }: Readonly<Props>) {
  return (
    <Button onClick={toggleOpen}>
      <PlusCircleIcon
        size={23}
        weight="fill"
        className={`transform: size-6 text-neutral-200 transition-transform duration-200 ${isOpen ? "rotate-[-135deg]" : "rotate-0"}`}
      />
      <div className="hidden sm:block">
        <p className="px-1 text-lg font-black text-neutral-200">Post</p>
      </div>
    </Button>
  );
}
