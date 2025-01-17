"use client";

import { Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import MentionDialog from "./MentionDialog";

interface TextInputProps {
  value: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function TextInput({
  value,
  setTextValue,
  inputRef,
}: Readonly<TextInputProps>) {
  const [mentionDialogOpen, setMentionDialogOpen] = useState(false);
  const [mentionedUser, setMentionedUser] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setTextValue((prev) => {
      return newValue.replace(/@\w+/g, (match) => {
        const username = match.slice(1);
        const tagMatch = RegExp(new RegExp(`\\{tag:\\d+:${username}\\}`)).exec(
          prev
        );
        return tagMatch ? tagMatch[0] : match;
      });
    });

    const mentionMatch = /@(\w+)\s*$/.exec(newValue);
    setMentionDialogOpen(!!mentionMatch);
    if (mentionMatch) setMentionedUser(mentionMatch[1]);
  };

  const toDisplayFormat = (text: string): React.ReactNode => {
    const tagRegex = /\{tag:(\d+):(.+?)\}/g;
    return text.replace(tagRegex, (_match, _p1, p2) => "@" + p2);
  };

  return (
    <Stack direction="column" sx={{ width: "100%", position: "relative" }}>
      <TextField
        inputRef={inputRef}
        value={toDisplayFormat(value)}
        onChange={handleChange}
        name="text"
        variant="outlined"
        placeholder="What do you wish you could tell the world?"
        fullWidth
        multiline
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
        }}
      />
      {mentionDialogOpen && (
        <MentionDialog
          mentionedUser={mentionedUser}
          setMentionDialogOpen={setMentionDialogOpen}
          setTextValue={setTextValue}
        />
      )}
    </Stack>
  );
}
