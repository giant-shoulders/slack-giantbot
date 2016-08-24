export default (userTag) => {
  const matches = userTag.match(/<@([a-zA-Z0-9][a-zA-Z0-9._-]*)>/);
  if (matches) return matches[1];
  return null;
};
