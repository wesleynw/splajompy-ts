import { useOtherLikes } from "@/app/data/likes";
import { renderMentions } from "@/app/utils/mentions";
import Box from "@mui/material/Box";

type Props = {
  post_id: number;
};

export default function OtherLikes({ post_id }: Readonly<Props>) {
  const { isPending, data } = useOtherLikes(post_id);

  if (isPending || !data || (data.likes?.length == 0 && !data.hasOthers)) {
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
      Liked by{" "}
      {data?.likes.reduce<React.ReactNode[]>((acc, like, index) => {
        const mention = renderMentions(
          `{tag:${like.user_id ?? ""}:${like.username}}`
        );
        if (index === 0) {
          return [mention];
        } else if (index === 1) {
          if (data.likes.length === 2 && data.hasOthers) {
            return [...acc, ", ", mention];
          }
          return [...acc, " and ", mention];
        } else {
          return [...acc, ", ", mention];
        }
      }, [])}
      {data.hasOthers &&
        (data.likes.length === 0
          ? " others"
          : data.likes.length === 1
          ? " and others"
          : ", and others")}
    </Box>
  );
}
