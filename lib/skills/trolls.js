import getUserInfo from '../utils/get-user-info';

let timers = [];

const trollEm = (bot, message, userID) => {
  return function() {
    getUserInfo(bot, userID).then((user) => {
      let userName = user.profile.first_name || user.name;
      bot.reply(message, `Watcha typing ${userName}? :kappa:`);
    });
  };
};

const skill = ({ controller }) => {
  controller.on('ambient', function(bot, message) {
    if (message.type !== 'message') { return; }

    const { user: userID } = message;

    let userTimer = timers.find(timer => timer.user === userID);
    if (!userTimer) { return; }

    let timerIndex = timers.indexOf(userTimer);

    clearTimeout(userTimer.timer);
    timers.splice(timerIndex, 1);
  });

  controller.on('message_received', function(bot, message) {
    if (message.type !== 'user_typing') { return; }

    const { user: userID } = message;
    const timeout = (Math.random() > 0.98) ? 50 : 20000;

    let userTimer = timers.find(timer => timer.user === userID);
    if (userTimer) { return; }

    timers.push({
      user: userID,
      timer: setTimeout(trollEm(bot, message, userID), timeout)
    });
  });
};

export default skill;
