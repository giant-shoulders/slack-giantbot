import Botkit from 'botkit';

import applySkills from './utils/apply-skills';

if (!process.env.GIANTBOT_TOKEN) {
	throw new Error('No GIANT_BOT token specified on ENVIRONMENT!');
}

const controller = Botkit.slackbot({});
const giantbot = controller.spawn({ token: process.env.GIANTBOT_TOKEN });

giantbot.startRTM((err) => {
	if (err) { throw new Error('Could not connect to Slack', err); }
	applySkills(controller, giantbot);
});
