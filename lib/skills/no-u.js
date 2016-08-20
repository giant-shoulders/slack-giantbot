const phrases = [
  'go to bed',
  'idiot',
];

const skill = ({ controller }) => {
  controller.hears(phrases, 'ambient', (bot, message) => {
    bot.reply(message, 'NO U!');
  });
};

export default skill;
