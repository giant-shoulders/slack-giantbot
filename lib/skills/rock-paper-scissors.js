import rollDice from '../utils/roll-dice';

const triggers = ['^!rps(?: (.*))?$'];
const sources = ['ambient'];

const choices = ['rock', 'paper', 'scissors'];
const choiceMap = {};

const TIE = 'TIE';
const PLAYER = 'PLAYER';
const BOT = 'BOT';
const INVALID = 'INVALID';

choices.forEach((choice, i) => {
  choiceMap[choice] = {};

  for (let j = 0, half = (choices.length - 1) / 2; j < choices.length; j += 1) {
    const opposition = (i + j) % choices.length;

    if (!j) {
      choiceMap[choice][choice] = TIE;
    } else if (j <= half) {
      choiceMap[choice][choices[opposition]] = PLAYER;
    } else {
      choiceMap[choice][choices[opposition]] = BOT;
    }
  }
});

const replies = {
  TIE: "A tie! Let's play again!",
  BOT: 'HAH! I WIN, NOOB! BETTER LUCK NEXT TIME.',
  PLAYER: 'Awwww mannnn, you got me. GG sir.',
  INVALID: 'Not.. sure.. what to do here..',
};

function compare(choice1, choice2) {
  return (choiceMap[choice1] || {})[choice2] || INVALID;
}

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    if (!message.match[1]) {
      bot.reply(message, `You need to pick something, dewd. (${choices.join(', ')})`);
      return;
    }

    const userChoice = message.match[1].toLowerCase();

    if (!choices.includes(userChoice)) {
      bot.reply(message, 'That is not a valid move. You lose. Good day sir!');
      return;
    }

    const botChoice = choices[rollDice({ sides: 3 })[0] - 1];
    const result = compare(botChoice, userChoice);

    bot.reply(message, `${botChoice.toUpperCase()}!!\n${replies[result]}`);
  });
};

export default skill;
