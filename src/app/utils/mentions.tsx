export const toDisplayFormat = (text: string): string => {
  const tagRegex = /\{tag:(\d+):(.+?)\}/g;
  return text.replace(tagRegex, (_match, _p1, p2) => "@" + p2);
};

export const highlightMentions = (text: string): React.ReactNode => {
  const mentionRegex = /(@\w+)/g;
  return text.split(mentionRegex).map((part, index) =>
    mentionRegex.test(part) ? (
      <span
        key={`${part}-${index}`}
        style={{
          backgroundColor: "rgba(53, 122, 191, 0.5)",
          borderRadius: "3px",
        }}
      >
        {part}
      </span>
    ) : (
      part
    )
  );
};
