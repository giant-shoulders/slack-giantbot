import getUserInfo from '../utils/get-user-info';

const skill = ({ controller }) => {
  controller.on('user_channel_join', (bot, message) => {
    const { user: userID } = message;

    getUserInfo(bot, userID).then((user) => {
      let userName = user.profile.first_name || user.name;
      bot.reply(message, `@channel - Gentlemen, say hello to ${userName}!`);
    });
  });
};

export default skill;
