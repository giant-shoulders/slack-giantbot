import crypto from 'crypto';
import * as messages from '../../messages';

const triggers = ['^!flip(?: ([0-9]*))?$'];
const sources = ['ambient', 'direct_mention', 'direct_message'];
const rngToString = number => (number % 2 ? ':coin-heads:' : ':coin-tails:');

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    const { user } = message;
    const [, _flips = 1] = message.match;
    const flips = parseInt(_flips, 10);

    if (flips > 100) {
      bot.reply(message, messages.impossible(user));
      return;
    }

    const rng = crypto.randomBytes(flips);
    const results = Array.prototype.map.call(rng, rngToString);

    bot.reply(message, {
      attachments: [{
        pretext: `<@${user}> flipped ${flips > 1 ? `${flips} coins` : 'a coin'}:`,
        text: results.join(' '),
      }],
    });
  });
};

export default skill;
