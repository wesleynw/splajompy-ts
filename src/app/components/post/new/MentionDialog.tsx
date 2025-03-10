import { useUsers } from "@/app/data/users";
import React from "react";
import { RichTextareaHandle } from "rich-textarea";

type Props = {
  mentionedUser: string;
  setMentionedUser: React.Dispatch<React.SetStateAction<string[]>>;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  setMentionDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  inputRef?: React.RefObject<RichTextareaHandle | null>;
};

export default function MentionDialog({
  mentionedUser,
  setMentionedUser,
  setTextValue,
  setMentionDialogOpen,
  inputRef,
}: Readonly<Props>) {
  const { isPending, users } = useUsers();

  function mentionToSpecialFormat(id: number, username: string) {
    const tag = `{tag:${id}:${username}}`;
    setTextValue((prev: string) => {
      const regex = new RegExp(`@${mentionedUser}(.*?)(?=@|$)`, "g");
      return prev.replace(regex, tag) + " ";
    });

    setMentionedUser((prev) => [...prev, username]);
  }

  return (
    <div className="relative z-50">
      <ul className="absolute rounded-lg border border-white bg-black py-0.5">
        {users && users.length > 0 && !isPending ? (
          (() => {
            const filteredUsers = users.filter((user) =>
              user.username.startsWith(mentionedUser),
            );

            return filteredUsers.length > 0 ? (
              filteredUsers.slice(0, 5).map((user, index) => (
                <div key={user.user_id}>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-800 focus:outline-none"
                    onClick={() => {
                      mentionToSpecialFormat(user.user_id, user.username);
                      setMentionDialogOpen(false);
                      inputRef?.current?.focus();
                    }}
                  >
                    {user.username}
                  </button>
                  {index < filteredUsers.length - 1 && (
                    <div className="border-t border-gray-600" />
                  )}
                </div>
              ))
            ) : (
              <li className="px-4 py-2">
                <h3>No users found</h3>
              </li>
            );
          })()
        ) : (
          <li className="px-4 py-2">...</li>
        )}
      </ul>
    </div>
  );
}
