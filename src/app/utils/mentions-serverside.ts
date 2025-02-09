// TODO: added this file temporarily to remove compiler errors, need to refactor so there's not two versions of these functions on the client AND server

export const internalTagRegex = /\{tag:(\d+):(.+?)\}/g;

export const toDisplayFormat = (text: string): string => {
  return text.replace(internalTagRegex, (_match, _p1, p2) => "@" + p2);
};

export const toMentionInternalFormat = (user_id: number, username: string) => {
  return `{tag:${user_id}:${username}}`;
};
