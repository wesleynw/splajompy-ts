import { renderMentions } from "@/app/utils/mentions";
import Linkify from "linkify-react";

type Props = {
  text: string | null;
};

interface LinkClickEvent extends React.MouseEvent<HTMLDivElement> {
  target: HTMLAnchorElement;
}

export default function PostTextContent({ text }: Readonly<Props>) {
  const options = { defaultProtocol: "https", target: "_blank" };

  const handleLinkClick = (e: LinkClickEvent) => {
    if (e.target.tagName === "A") {
      e.stopPropagation();
      e.preventDefault();
    }
  };

  if (!text) {
    return;
  }

  console.log("mentions: ", renderMentions(text));

  return (
    <div className="break-word my-3 font-bold">
      <div onClick={handleLinkClick}>
        <Linkify options={options}>{renderMentions(text)}</Linkify>
      </div>
    </div>
  );
}
