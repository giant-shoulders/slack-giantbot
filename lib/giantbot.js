import * as skills from './skills';
import { format } from './utils';

import Botkit from 'botkit';

if (!process.env.GIANTBOT_TOKEN) {
  throw new Error('No GIANT_BOT token specified on ENVIRONMENT!');
}

const controller = Botkit.slackbot({});
const giantbot = controller.spawn({ token: process.env.GIANTBOT_TOKEN });

const applySkills = (controller, giantbot) => Object.keys(skills).forEach(key => skills[key]({ controller, giantbot }));

giantbot.startRTM((err) => {
  if (err) { throw new Error('Could not connect to Slack', err); }
  applySkills(controller, giantbot);
});
