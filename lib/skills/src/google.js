import GoogleSearch from 'google-search';
import MAIN_CONFIG from '../../config';

const google = new GoogleSearch({
  key: MAIN_CONFIG.GOOGLE_SEARCH_KEY,
  cx: MAIN_CONFIG.GOOGLE_SEARCH_CX_KEY,
});

const sources = ['ambient'];
const trigger = `^\\?([a-zA-Z0-9\\. -_#]+)$`;

const skill = ({ controller }) => {
  controller.hears(trigger, sources, (bot, message) => {
    if (!MAIN_CONFIG.GOOGLE_SEARCH_KEY || !MAIN_CONFIG.GOOGLE_SEARCH_CX_KEY) { return; }
    if (!message.match[1]) { return; }

    const q = message.match[1];
    google.build({ q }, (err, response) => {
      if (err) { return; }

      const result = response.items.shift();
      const { title, link, snippet } = result;
      const timestamp = Math.floor(Date.now() / 1000);

      bot.reply(message, {
        attachments: [
          {
            author_name: ':google: Google Search',
            author_link: 'http://google.com/',
            title_link: link,
            title,
            pretext: `*Searching "${q}"*`,
            text: snippet,
            ts: timestamp,
            mrkdwn_in: ['title', 'pretext'],
          },
        ],
      });
    });
  });
};

export default skill;
