import { matchers, getChannelId, getUserId, getUserInfo } from '../../utils';

const trigger = `tell (?:(${matchers.USER_TAG})|(${matchers.CHANNEL_TAG})) (.*)`;
const sources = ['direct_message', 'direct_mention'];

const skill = ({ controller }) => {
  controller.hears(trigger, sources, (bot, message) => {
    const [, user, channel, text] = message.match;

    if (channel) {
      const channelId = getChannelId(channel);

      if (channelId) bot.say({ channel: channelId, text });
    } else if (user) {
      const userId = getUserId(user);

      if (userId) {
        getUserInfo(bot, userId)
          .then(userInfo => {
            bot.api.chat.postMessage({ channel: `@${userInfo.name}`, text, as_user: true });
          });
      }
    }
  });
};

export default skill;
