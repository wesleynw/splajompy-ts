import { useUsers } from "@/app/data/users";
import { Box, List, ListItemButton } from "@mui/material";

type Props = {
  mentionedUser: string;
  setMentionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
};

export default function MentionDialog({
  mentionedUser,
  setTextValue,
}: Readonly<Props>) {
  const { isPending, users } = useUsers();

  if (isPending) {
    return <h1>loading lol...</h1>;
  }

  function mentionToSpecialFormat(id: number, username: string) {
    console.log("mentioned user:", mentionedUser);
    const tag = `{tag:${id}:${username}}`;
    console.log("USERTAG: ", tag);
    setTextValue((prev: string) => {
      console.log("prev: ", prev);
      const regex = new RegExp(`@${mentionedUser}(.*?)(?=@|$)`, "g");
      const x = prev.replace(regex, tag);
      console.log("SPECIAL TEXT: ", x);
      return x;
    });
  }

  return (
    <Box sx={{ zIndex: "100" }}>
      <List
        dense={true}
        sx={{ position: "fixed", backgroundColor: "red", borderRadius: "10px" }}
      >
        {users
          ?.filter((user) => user.username.startsWith(mentionedUser))
          .slice(0, 5)
          .map((user) => (
            <ListItemButton
              key={user.user_id}
              onClick={() =>
                mentionToSpecialFormat(user.user_id, user.username)
              }
            >
              {user.username}
            </ListItemButton>
          ))}
      </List>
    </Box>
  );
}
