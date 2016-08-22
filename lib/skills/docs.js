import * as match from '../utils/matchers';

const sources = ['ambient', 'direct_message', 'direct_mention', 'mention'];
const trigger = `^!docs (${match.USER_TAG})?\\s?([a-zA-Z0-9 ]+)$`;

const skill = ({ controller }) => {
  controller.hears(trigger, sources, (bot, message) => {
    const reply = [];

    if (message.match[1]) {
      reply.push(`${message.match[1]}:`);
    } else {
      reply.push(`<@${message.user}>`);
    }

    reply.push(`https://devdocs.io/#q=${encodeURIComponent(message.match[2])}`);
    bot.reply(message, reply.join(' '));
  });
};

export default skill;
