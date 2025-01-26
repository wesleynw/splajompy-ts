import { renderMentions } from "@/app/utils/mentions";
import Box from "@mui/material/Box";
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
    <Box
      sx={{
        fontWeight: "bold",
        marginBottom: 3,
        color: "#ffffff",
        whiteSpace: "pre-line",
        overflowWrap: "break-word",
        "& a": {
          color: "lightblue",
          textDecoration: "underline",
        },
        "& a:hover": {
          cursor: "pointer",
        },
      }}
    >
      <Box onClick={handleLinkClick}>
        <Linkify options={options}>{renderMentions(text)}</Linkify>
      </Box>
    </Box>
  );
}
