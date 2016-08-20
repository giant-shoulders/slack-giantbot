import Botkit from 'botkit';

import applySkills from './internal/apply-skills';

const controller = Botkit.slackbot({});
const giantbot = controller.spawn({ token: process.env.GIANTBOT_TOKEN });

giantbot.startRTM();

applySkills(controller, giantbot);
