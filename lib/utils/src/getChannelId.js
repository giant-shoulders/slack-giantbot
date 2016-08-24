export default (channelTag) => {
  const matches = channelTag.match(/<#([a-zA-Z0-9]*)(?:\|[a-zA-Z0-9_-]*)>/);
  if (matches) return matches[1];
  return null;
};
