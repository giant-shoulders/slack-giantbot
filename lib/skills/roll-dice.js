import rollDice from '../utils/roll-dice';
import getUserInfo from '../utils/get-user-info';

const triggers = ['^!roll(?: ?([0-9]+)?(?:[d ]?([0-9]+))?)?'];
const sources = ['ambient', 'direct_mention', 'direct_message'];

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    const { user: userID, match: [, _count = 1, _sides = 6] } = message;
    const count = parseInt(_count, 10);
    const sides = parseInt(_sides, 10);

    getUserInfo(bot, userID)
      .then(user => {
        if (count > 15) {
          let name;

          if (user.profile.first_name && user.profile.first_name.length > 0) {
            name = `${user.profile.first_name}.`;
          } else {
            name = `@${user.name}`;
          }

          bot.reply(message, `I'm afraid I can't do that, ${name}`);
          return;
        }

        const results = rollDice({ count, sides });
        const total = results.reduce((a, b) => a + b, 0);

        const reply = [`@${user.name} rolled`];

        reply.push(count !== 1 ? count : 'a');

        if (count !== 1) {
          if (sides !== 6) reply.push(`${sides}-sided`);
          reply.push(`dice.\n${results.join(', ')} — total:`);
        }

        reply.push(`${total}.`);

        bot.reply(message, reply.join(' '));
      });
  });
};

export default skill;
