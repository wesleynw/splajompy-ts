import { renderMentions } from "@/app/utils/mentions";
import Linkify from "linkify-react";

type Props = {
  text: string | null;
};

export default function PostTextContent({ text }: Readonly<Props>) {
  const options = {
    defaultProtocol: "https",
    target: "_blank",
    className: "linkify-link",
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!text) {
    return;
  }

  return (
    <div className="break-word my-3 font-bold">
      <div
        onClick={handleLinkClick}
        className="[&>p>a]:text-red-400 [&>p>a]:hover:text-red-600 [&>p>a]:hover:underline"
      >
        <Linkify as="p" options={options}>
          {renderMentions(text)}
        </Linkify>
      </div>
    </div>
  );
}
