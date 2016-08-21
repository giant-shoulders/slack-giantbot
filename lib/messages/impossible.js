export default (user) => {
  let name;

  if (user) {
    if (user.profile.first_name && user.profile.first_name.length > 0) {
      name = `${user.profile.first_name}.`;
    } else {
      name = `@${user.name}`;
    }
  }

  const message = ["I'm afraid I can't do that"];

  if (name) {
    message.push(`, ${name}`);
  } else {
    message.push('.');
  }

  return message.join('');
};
