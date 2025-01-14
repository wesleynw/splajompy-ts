"use client";

import { Box, Stack, TextField } from "@mui/material";
import React, { useState } from "react";
import MentionDialog from "./MentionDialog";

interface TextInputProps {
  value: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export function TextInput2({
  value,
  setTextValue,
  inputRef,
}: Readonly<TextInputProps>) {
  const [mentionDialogOpen, setMentionDialogOpen] = useState(false);
  const [mentionedUser, setMentionedUser] = useState("");

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("event: ", event.target.value);
    event.target.value = event.target.value.toLowerCase();
    const value = event.target.value;
    if (value.includes("@")) {
      console.log("SHIT");
      setMentionDialogOpen(true);

      const userTag = value.match(/@(\w+)\s*/);
      if (userTag) {
        setMentionedUser(userTag[1]);
      }
      console.log("SHIT!: ", userTag);
    } else {
      setMentionDialogOpen(false);
    }

    setTextValue(event.target.value);
  };

  // hey! tag:wesley:12

  // weley --> <strong>weley</strong>

  const formatTags = (text: string): React.ReactNode => {
    const tagRegex = /@\{tag:(\d+):(.+)\}/g;
    const parts = text.split(tagRegex);

    return parts.map((part, index) => {
      if (index % 3 === 2) {
        const userName = part;
        return (
          <span key={`${userName}-${index}`} style={{ fontWeight: "bold" }}>
            {userName}
          </span>
        );
      }
      if (index % 3 === 2) {
        return null;
      }
      return part;
    });
  };

  return (
    <Stack direction="column" sx={{ width: "100%", position: "relative" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          color: value ? "black" : "transparent",
          zIndex: 1,
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          fontFamily: "inherit",
          fontSize: "inherit",
          lineHeight: "inherit",
          padding: "16.5px 14px",
        }}
      >
        <span style={{ color: "white" }}>{formatTags(value)}</span>
      </Box>
      <TextField
        inputRef={inputRef}
        value={value}
        onChange={handleChange}
        name="text"
        variant="outlined"
        placeholder="What do you wish you could tell the world?"
        fullWidth
        multiline
        sx={{
          position: "relative",
          background: "transparent",
          "& .MuiInputBase-input": {
            color: value ? "transparent" : "",
            backgroundColor: "transparent",
            fontFamily: "inherit",
            fontSize: "inherit",
            lineHeight: "inherit",
          },
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
