const coinFlip = () => ((Math.floor(Math.random() * 2) === 0) ? 'heads' : 'tails');

const handleCoinFlip = (bot, message) => {
  bot.reply(message, coinFlip());
};

const skill = ({ controller }) => {
  controller.hears(['flip a coin'], 'mention,direct_message,direct_mention', handleCoinFlip);
  controller.hears(['!flip'], 'ambient', handleCoinFlip);
};

export default skill;
