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
    <div className="my-3 font-bold">
      <div onClick={handleLinkClick} className="[&>p>a]:hover:underline">
        <Linkify as="p" options={options} className="break-words">
          {renderMentions(text)}
        </Linkify>
      </div>
    </div>
  );
}
