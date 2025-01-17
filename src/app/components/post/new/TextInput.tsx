"use client";

import { Stack } from "@mui/material";
import React, { useState } from "react";
import MentionDialog from "./MentionDialog";
import Editor from "react-simple-code-editor";
import { highlightMentions, toDisplayFormat } from "@/app/utils/mentions";

interface TextInputProps {
  value: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
}

export function TextInput({ value, setTextValue }: Readonly<TextInputProps>) {
  const [mentionDialogOpen, setMentionDialogOpen] = useState(false);
  const [mentionedUser, setMentionedUser] = useState("");

  const handleChange = (newValue: string) => {
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

  return (
    <Stack direction="column" sx={{ width: "100%", position: "relative" }}>
      <div style={{ position: "relative", width: "100%" }}>
        {value === "" && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              color: "#aaa",
              pointerEvents: "none",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            What do you wish you could tell the world?
          </div>
        )}

        <Editor
          value={toDisplayFormat(value)}
          onValueChange={handleChange}
          highlight={(code) => highlightMentions(code)}
          padding={10}
          style={{
            fontSize: "16px",
            border: "2px solid",
            borderColor: "#4a90e2",
            borderRadius: "8px",
            lineHeight: "1.5",
            color: "#fff",
            width: "100%",
            minHeight: "60px",
            outline: "none",
            overflow: "auto",
            resize: "none",
          }}
        />
      </div>

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
