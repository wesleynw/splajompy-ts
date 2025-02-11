type Props = {
  markRead: () => void;
};

export default function MarkReadButton({ markRead }: Readonly<Props>) {
  const handleClick = () => {
    console.log("bbb");
    markRead();
  };
  return (
    <button
      className="m-1.5 flex flex-row rounded-lg bg-blue-400 px-2 py-2 font-bold text-neutral-100 hover:cursor-pointer"
      onClick={handleClick}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="relative -left-4.5 -mr-3.5 size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m4.5 12.75 6 6 9-13.5"
        />
      </svg>
      Mark all as read
    </button>
  );
}
