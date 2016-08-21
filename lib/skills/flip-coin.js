const coinFlip = () => ((Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails');

const skill = ({ controller }) => {
  controller.hears(['!flip'], 'ambient,direct_mention,direct_message', (bot, message) => {
    bot.reply(message, coinFlip());
  });
};

export default skill;
