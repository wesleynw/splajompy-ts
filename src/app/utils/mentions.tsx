"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export const internalTagRegex = /\{tag:(\d+):(.+?)\}/g;

export const toDisplayFormat = (text: string): string => {
  return text.replace(internalTagRegex, (_match, _p1, p2) => "@" + p2);
};

export const toPreviewFormat = (
  text: string,
  mentionedUsers: string[],
): React.ReactNode => {
  if (mentionedUsers.length === 0) {
    return <span style={{ color: "white" }}>{text}</span>;
  }

  const formattedUsers = mentionedUsers.map((user) => `@${user}`);
  const mentionRegex = new RegExp(`(${formattedUsers.join("|")})`, "g");

  return text.split(mentionRegex).map((part, index) =>
    mentionRegex.test(part) ? (
      <span
        key={`${part}-${index}`}
        style={{
          color: "white",
          backgroundColor: "rgba(53, 122, 191, 0.5)",
          borderRadius: "3px",
        }}
      >
        {part}
      </span>
    ) : (
      <span
        key={`${part}-${index}`}
        style={{
          color: "white",
        }}
      >
        {part}
      </span>
    ),
  );
};

export const renderMentions = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(internalTagRegex, (match, userId, username, offset) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }
    parts.push(
      <Link key={offset} href={`/user/${username}`}>
        <span className="font-bold text-blue-300 hover:cursor-pointer hover:underline">
          {"@" + username}
        </span>
      </Link>,
    );
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
};

export function RenderMentions({ text }: Readonly<{ text: string }>) {
  const router = useRouter();

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  text.replace(internalTagRegex, (match, userId, username, offset) => {
    if (offset > lastIndex) {
      parts.push(text.slice(lastIndex, offset));
    }
    parts.push(
      <button
        key={offset}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/user/${username}`);
        }}
        className="text-blue-300 hover:cursor-pointer"
      >
        {"@" + username}
      </button>,
    );
    lastIndex = offset + match.length;
    return match;
  });

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts}</>;
}
