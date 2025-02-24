"use client";

import { toDisplayFormat, toPreviewFormat } from "@/app/utils/mentions";
import React, { useState } from "react";
import { RichTextarea, RichTextareaHandle } from "rich-textarea";
import MentionDialog from "./MentionDialog";

interface TextInputProps {
  placeholder: string;
  value: string;
  setTextValue: React.Dispatch<React.SetStateAction<string>>;
  inputRef?: React.RefObject<RichTextareaHandle | null>;
}

export function TextInput({
  placeholder,
  value,
  setTextValue,
  inputRef,
}: Readonly<TextInputProps>) {
  const [mentionDialogOpen, setMentionDialogOpen] = useState(false);
  const [mentionedUser, setMentionedUser] = useState("");

  const handleChange = (newValue: string) => {
    setTextValue((prev) => {
      return newValue.replace(/@\S+/g, (match) => {
        const username = match.slice(1);
        const tagMatch = RegExp(new RegExp(`\\{tag:\\d+:${username}\\}`)).exec(
          prev,
        );
        return tagMatch ? tagMatch[0] : match;
      });
    });
    const mentionMatch = /@(\w+)$/.exec(newValue);
    setMentionDialogOpen(!!mentionMatch);
    if (mentionMatch) setMentionedUser(mentionMatch[1]);
  };

  return (
    <div className="w-full">
      <RichTextarea
        className="w-full resize-none overflow-hidden rounded-md border-1 border-neutral-600 p-2 focus:outline-1 focus:outline-neutral-400"
        ref={inputRef}
        value={toDisplayFormat(value)}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          handleChange(e.target.value)
        }
        rows={1}
        autoHeight
        style={{ width: "100%" }}
      >
        {(v: string) => {
          if (v.length === 0) {
            return <span style={{ color: "#AAA" }}>{placeholder}</span>;
          }
          return toPreviewFormat(v);
        }}
      </RichTextarea>

      {mentionDialogOpen && (
        <MentionDialog
          mentionedUser={mentionedUser}
          setMentionDialogOpen={setMentionDialogOpen}
          setTextValue={setTextValue}
          inputRef={inputRef}
        />
      )}
    </div>
  );
}
