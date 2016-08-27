import Botkit from 'botkit';
import MAIN_CONFIG from './config';

import { format } from './utils';
import * as skills from './skills';

if (!MAIN_CONFIG.GIANTBOT_TOKEN) {
  throw new Error('No GIANT_BOT token specified on ENVIRONMENT!');
}

const controller = Botkit.slackbot({
  debug: false,
  json_file_store: './db',
});
const giantbot = controller.spawn({ token: MAIN_CONFIG.GIANTBOT_TOKEN });

const applySkills = () => {
  Object.keys(skills).forEach(key => (
    skills[key]({ controller, giantbot })
  ));
};

giantbot.startRTM((err) => {
  if (err) { throw new Error('Could not connect to Slack', err); }
  applySkills();
});
