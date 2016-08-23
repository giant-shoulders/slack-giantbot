import * as messages from '../../messages';

const coinFlip = () => (Math.random() < 0.5 ? ':coin-heads:' : ':coin-tails:');

const triggers = ['^!flip(?: ([0-9]*))?$'];
const sources = ['ambient', 'direct_mention', 'direct_message'];

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    const { user } = message;
    const [, _flips = 1] = message.match;
    const flips = parseInt(_flips, 10);

    if (flips > 100) {
      bot.reply(message, messages.impossible(user));
      return;
    }

    const results = [];

    for (let i = 0; i < flips; i += 1) {
      results.push(coinFlip());
    }

    bot.reply(message, {
      attachments: [{
        pretext: `<@${user}> flipped ${flips > 1 ? `${flips} coins` : 'a coin'}:`,
        text: results.join(' '),
      }],
    });
  });
};

export default skill;
