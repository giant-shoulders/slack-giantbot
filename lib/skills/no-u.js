const triggers = ['go to bed'];
const sources = ['ambient'];

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    bot.reply(message, 'NO U!');
  });
};

export default skill;
