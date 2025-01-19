const internalTagRegex = /\{tag:(\d+):(.+?)\}/g;

export const toDisplayFormat = (text: string): string => {
  return text.replace(internalTagRegex, (_match, _p1, p2) => "@" + p2);
};

export const toPreviewFormat = (text: string): React.ReactNode => {
  const mentionRegex = /(@\S+)/g;
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

// export const toDisplayFormat = (text: string): React.ReactNode => {};
