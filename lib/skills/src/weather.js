import request from 'request-promise';
import API_KEYS from '../../config';

const API_KEY = API_KEYS.WU_KEY;
const API_ROUTES = [
  `http://api.wunderground.com/api/{key}/conditions/q/{zip}.json`,
  `http://api.wunderground.com/api/{key}/forecast/q/{zip}.json`,
];

const sources = ['ambient'];
const trigger = `^!weather(?: ([0-9]{5}))?$`;

const skill = ({ controller }) => {
  controller.hears(trigger, sources, (bot, message) => {
    if (!message.match[1]) {
      bot.reply(message, `Supply me a zip code, bunhead! :neutral_face:`);
      return;
    }

    const { user } = message;
    const zip = message.match[1];

    // Build up promises from API_ROUTES for Promise.all()
    const promises = [];
    API_ROUTES.forEach(route => {
      const args = {
        method: 'GET',
        uri: route.format({ key: API_KEY, zip }),
        json: true,
      };
      promises.push(request(args));
    });

    // Expects Promises in order of [conditions, forecast];
    // MUST UPDATE if changing API_ROUTES or adding new ones
    Promise.all(promises)
      .then(response => {
        // Parse Response
        const [{ current_observation: conditions }, { forecast }] = response;
        const { simpleforecast: { forecastday: [todayForecast] } } = forecast;

        // Get Values We Want
        const timestamp = Math.floor(Date.now() / 1000);
        const { image: { url, title, link } } = conditions;
        const { temp_f: currentTemp, display_location: { city }, weather, icon_url: weatherIcon } = conditions;
        const { high: { fahrenheit: high }, low: { fahrenheit: low } } = todayForecast;

        bot.reply(message, {
          attachments: [
            {
              fallback: `Weather for "${zip}" - Current: ${currentTemp} - High: ${high} - Low: ${low}`,
              author_name: title,
              author_link: link,
              author_icon: url,
              title: `Weather for ${city}`,
              pretext: `*Weather search for "${zip}" via <@${user}>*`,
              text: `It's currently ${currentTemp}° and ${weather} in ${city}. The estimated temperatures for today are a high of ${high}° and a low of ${low}°.`,
              thumb_url: weatherIcon,
              ts: timestamp,
              fields: [{
                title: 'Current Temperature',
                value: `${currentTemp}°`,
                short: true,
              }, {
                title: 'Current Conditions',
                value: weather,
                short: true,
              }, {
                title: 'High Temperature',
                value: `${high}°`,
                short: true,
              }, {
                title: 'Low Temperature',
                value: `${low}°`,
                short: true,
              }],
              mrkdwn_in: ['pretext'],
            },
          ],
        });
      }).catch(() => bot.reply(message, `Something went wrong while querying the weather. :face_with_head_bandage:`));
  });
};

export default skill;
