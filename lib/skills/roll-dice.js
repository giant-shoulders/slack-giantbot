import rollDice from '../utils/roll-dice';

const triggers = ['^!roll(?: ?([0-9]+)?(?:[d ]?([0-9]+))?)?'];
const sources = ['ambient', 'direct_mention', 'direct_message'];

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    const [, count = 1, sides = 6] = message.match;

    if (count > 15) {
      bot.reply(message, 'Why do you have to be that guy?');
      return;
    }

    const results = rollDice({ count, sides });
    const total = results.reduce((a, b) => a + b, 0);
    const reply = `You rolled ${count} ${sides}-sided dice; `
      + `your results are: ${results.join(', ')}. A total of ${total}.`;

    bot.reply(message, reply);
  });
};

export default skill;
