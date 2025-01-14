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

  // hey! tag:wesley:12
  // weley --> <strong>weley</strong>
  function mentionToSpecialFormat(id: number, username: string) {
    const tag = `{tag:${id}:${username}}`;
    console.log("USERTAG: ", tag);
    setTextValue((prev: string) => {
      const x = prev.replace(mentionedUser, tag);
      console.log("SPECFIAL TEXT: ", x);
      return x;
    });
  }

  // setTextValue((prev) => )

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
