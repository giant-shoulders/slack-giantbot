import rollDice from '../utils/roll-dice';

const TIE = 'TIE';
const PLAYER = 'PLAYER';
const BOT = 'BOT';
const INVALID = 'INVALID';

const replies = {
  TIE: "A tie! Let's play again!",
  BOT: 'HAH! I WIN, NOOB! BETTER LUCK NEXT TIME.',
  PLAYER: 'Awwww mannnn, you got me. GG sir.',
  INVALID: 'Not.. sure.. what to do here..',
};

const generateChoiceMap = (choices) => {
  const choiceMap = {};

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

  return choiceMap;
};

const defaultChoices = ['rock', 'paper', 'scissors'];
const defaultChoiceMap = generateChoiceMap(defaultChoices);

function compare(choiceMap, choice1, choice2) {
  return (choiceMap[choice1] || {})[choice2] || INVALID;
}

const trigger = '^!rps(?: ([a-zA-Z0-9_]+)(?: ([a-zA-Z0-9_,]+))?)?$';

const skill = ({ controller }) => {
  controller.hears(trigger, 'ambient', (bot, message) => {
    let choices;
    let choiceMap;

    if (message.match[2]) {
      choices = message.match[2].split(',');
      choiceMap = generateChoiceMap(choices);
    } else {
      choices = defaultChoices;
      choiceMap = defaultChoiceMap;
    }

    if (!message.match[1]) {
      bot.reply(message, `You need to pick something, dewd. (${choices.join(', ')})`);
      return;
    }

    const userChoice = message.match[1].toLowerCase();

    if (!choices.includes(userChoice)) {
      bot.reply(message, 'That is not a valid move. You lose. Good day sir!');
      return;
    }

    const botChoice = choices[rollDice({ sides: choices.length })[0] - 1];
    const result = compare(choiceMap, botChoice, userChoice);

    bot.reply(message,
`<@${message.user}>: ${botChoice.toUpperCase()}!!
<@${message.user}>: ${replies[result]}`
    );
  });
};

export default skill;
