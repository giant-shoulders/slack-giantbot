const SEND_DELAY = 3000;
const RESET_DELAY = 7500;
const TROLLS = [
  `Watcha typing <@{user}>? :kappa:`,
  `Hey <@{user}>, why not share that thought with the rest of us? :kappa:`,
  `Go ahead and share, <@{user}>, I'm sure your message is perfect. :kappa:`,
  `<@{user}>, I'm bet you're making a great point. :kappa:`,
  `You really have me on the edge of my seat, <@{user}>. :kappa:`,
  `Oh <@{user}>... the suspense is killing me. :kappa:`,
];

let typists = [];

let timers = [];
let resetTimers = [];

const arrayFind = (array, key, item) => {
  return array.find(single => single[key] === item);
};

const arrayRemove = (array, item) => {
  let arrayIndex = array.indexOf(item);
  if (arrayIndex > -1) {
    array.splice(arrayIndex, 1);
  }
};

const getMessage = (user) => {
  return TROLLS[Math.floor(Math.random() * TROLLS.length)].format({ user });
};

const trollEm = (bot, message, userID) => {
  return function() {
    const { user } = message;
    bot.reply(message, getMessage(user));
  };
};

const clearTimer = (timersList, timer) => {
  clearTimeout(timer.timer);
  arrayRemove(timersList, timer);
};

const resetTimer = (bot, message, userID, typistEntry, timeout) => {
  let userResetTimer = arrayFind(resetTimers, 'user', userID);

  // Decrement count and restart timer if count > 0
  const decrementCount = function() {
    typistEntry.count = (typistEntry.count > 0) ? typistEntry.count - 1 : 0;

    if (typistEntry.count > 0) {
      userResetTimer.timer = setTimeout(decrementCount, timeout);
    }
  };

  // Create or update timer
  if (!userResetTimer) {
    userResetTimer = {
      user: userID,
      timer: setTimeout(decrementCount, timeout)
    };
    resetTimers.push(userResetTimer);
  } else {
    clearTimeout(userResetTimer.timer);
    userResetTimer.timer = setTimeout(decrementCount, timeout);
  }

  return userResetTimer;
};

const setTimer = (bot, message, userID, timeout) => {
  // Clear reset timer if exists
  let userResetTimer = arrayFind(resetTimers, 'user', userID);
  if (userResetTimer) {
    clearTimer(resetTimers, userResetTimer);
  }

  // Ignore if already set
  let userTimer = arrayFind(timers, 'user', userID);
  if (userTimer) { return; }

  timers.push({
    user: userID,
    timer: setTimeout(trollEm(bot, message, userID), timeout)
  });
};

const skill = ({ controller }) => {
  // Check if user typing
  controller.on('message_received', (bot, message) => {
    if (message.type !== 'user_typing') { return; }

    const { user: userID } = message;
    const timeout = (Math.random() > 0.985) ? 0 : SEND_DELAY;

    let typistEntry = arrayFind(typists, 'user', userID);

    // Already triggered, ignore
    if (typistEntry && typistEntry.triggered) { return; }

    // Increment count (and optionally make entry)
    if (!typistEntry) {
      typistEntry = { user: userID, delay: timeout, count: 1 };
      typists.push(typistEntry);
    } else {
      typistEntry.count = (typistEntry.count < 3) ? typistEntry.count + 1 : 3;
    }

    // Check that user has typed three times, or insta-troll
    if (typistEntry.count > 2 || typistEntry.delay === 0) {
      typistEntry.triggered = true;
      setTimer(bot, message, userID, typistEntry.delay);

    // Lower user count if they stop typing before reaching threshold
    } else {
      resetTimer(bot, message, userID, typistEntry, RESET_DELAY);
    }
  });

  // Check if user sent message
  controller.on('ambient', (bot, message) => {
    if (message.type !== 'message') { return; }

    const { user: userID } = message;

    // Reset user entry
    let typistEntry = arrayFind(typists, 'user', userID);
    if (typistEntry) {
      typistEntry.count = 0;
      typistEntry.triggered = false;
    }

    // Reset user timer if exists
    let userTimer = arrayFind(timers, 'user', userID);
    if (userTimer) { clearTimer(timers, userTimer); }

    // Reset reset timer if exists
    let userResetTimer = arrayFind(resetTimers, 'user', userID);
    if (userResetTimer) { clearTimer(resetTimers, userResetTimer); }
  });
};

export default skill;
