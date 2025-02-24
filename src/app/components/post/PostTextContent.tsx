import { RenderMentions } from "@/app/utils/mentions";
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
    }
  };

  if (!text) {
    return;
  }

  return (
    <div className="mb-3 font-bold break-all">
      <div onClick={handleLinkClick}>
        <Linkify options={options}>
          <RenderMentions text={text} />
        </Linkify>
      </div>
    </div>
  );
}
