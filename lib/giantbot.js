import Botkit from 'botkit';

import { format } from './utils';
import * as skills from './skills';

if (!process.env.GIANTBOT_TOKEN) {
  throw new Error('No GIANT_BOT token specified on ENVIRONMENT!');
}

const controller = Botkit.slackbot({ debug: false });
const giantbot = controller.spawn({ token: process.env.GIANTBOT_TOKEN });

const applySkills = () => {
  Object.keys(skills).forEach(key => (
    skills[key]({ controller, giantbot })
  ));
};

giantbot.startRTM((err) => {
  if (err) { throw new Error('Could not connect to Slack', err); }
  applySkills();
});
