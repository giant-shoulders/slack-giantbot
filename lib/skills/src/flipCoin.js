import crypto from 'crypto';
import * as messages from '../../messages';

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

    const details = {
      heads: 0,
      tails: 0,
      sequences: [],
    };

    let currentSequence = { face: null, length: 0 };

    const rng = crypto.randomBytes(flips);
    const results = Array.prototype.map.call(rng, number => {
      const face = number % 2 ? 'heads' : 'tails';

      if (flips > 10) {
        details[face] += 1;

        if (face !== currentSequence.face) {
          if (currentSequence.length >= 2) details.sequences.push(currentSequence);
          currentSequence = { face, length: 1 };
        } else {
          currentSequence.length += 1;
        }
      }

      return `:coin-${face}:`;
    });

    const reply = [results.join(' ')];

    if (flips > 10) {
      details.sequences.sort((a, b) => {
        if (b.length > a.length) return 1;
        if (b.length < a.length) return -1;
        return 0;
      });

      const sequence = details.sequences[0];

      reply.push(
        `\n— ${details.heads} × :coin-heads:   ${details.tails} × :coin-tails:`
        + `  |  longest sequences was ${sequence.length} :coin-${sequence.face}: in a row!`
      );
    }

    bot.reply(message, {
      attachments: [{
        pretext: `<@${user}> flipped ${flips > 1 ? `${flips} coins` : 'a coin'}:`,
        text: reply.join(''),
      }],
    });
  });
};

export default skill;
