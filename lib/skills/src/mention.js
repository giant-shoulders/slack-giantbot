
const skill = ({ controller }) => {
  const salute = (bot, message) => {
    bot.reply(message, `You rang, sir? :bowtie:`);
  };

  controller.on('mention', salute);
  controller.on('direct_mention', (bot, message) => {
    if (message.text.length === 0) { salute(bot, message); }
  });
};

export default skill;
