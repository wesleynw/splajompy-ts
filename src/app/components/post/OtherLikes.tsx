import { useOtherLikes } from "@/app/data/likes";
import { renderMentions } from "@/app/utils/mentions";
import Box from "@mui/material/Box";

type Props = {
  post_id: number;
};

export default function OtherLikes({ post_id }: Readonly<Props>) {
  const { isPending, likes } = useOtherLikes(post_id);

  if (isPending || !likes || likes?.length < 1) {
    return;
  }

  return (
    <Box
      sx={{
        fontWeight: "800",
        fontSize: "14px",
        "& a": {
          color: "lightblue",
          textDecoration: "underline",
        },
        "& a:hover": {
          cursor: "pointer",
        },
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      Also liked by{" "}
      {likes?.reduce<React.ReactNode[]>((acc, like, index) => {
        const mention = renderMentions(
          `{tag:${like.user_id ?? ""}:${like.username}}`
        );
        if (index === 0) {
          return [mention];
        } else if (index === likes.length - 1) {
          return [...acc, " and ", mention];
        } else {
          return [...acc, ", ", mention];
        }
      }, [])}
    </Box>
  );
}
