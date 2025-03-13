import { renderMentions } from "@/app/utils/mentions";
import Linkify from "linkify-react";
import React from "react";

type Props = {
  text: string | null;
};

export default function PostTextContent({ text }: Readonly<Props>) {
  const options = {
    defaultProtocol: "https",
    target: "_blank",
    className: "linkify-link",
    attributes: {
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
      },
    },
  };

  if (!text) {
    return;
  }

  return (
    <div className="my-3 font-bold">
      <Linkify
        as="p"
        options={options}
        className="preserve-b break-words whitespace-pre-line"
      >
        {renderMentions(text)}
      </Linkify>
    </div>
  );
}
