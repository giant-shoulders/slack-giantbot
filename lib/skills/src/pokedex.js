import Pokedex from 'pokedex-promise-v2';

const triggers = ['^!pokedex(?: ([a-zA-Z-. ]+))$'];
const sources = ['ambient', 'direct_mention', 'direct_message'];

const pokedex = new Pokedex();

const skill = ({ controller }) => {
  controller.hears(triggers, sources, (bot, message) => {
    if (!message.match[1]) {
      bot.reply(message, `What pokemon should I look for?`);
      return;
    }

    const [, title] = message.match;
    const { user } = message;

    const pokemon = pokedex.getPokemonByName(title.replace(/\s+/g, '-').replace(/\./g, ''));
    const pokemonSpecies = pokemon.then(pokemonResult =>
      pokedex.getPokemonSpeciesByName(pokemonResult.species.name)
    );

    Promise.all([pokemon, pokemonSpecies]).then(value => {
      const pokemonResult = value[0];
      const speciesResult = value[1];

      const timestamp = Math.floor(Date.now() / 1000);
      const types = pokemonResult.types.map(elem =>
        elem.type.name
      ).join(', ');
      const abilities = pokemonResult.abilities.map(elem =>
        elem.ability.name
      ).join(', ');

      const filteredPokedexText = speciesResult.flavor_text_entries.filter((element) =>
        element.language.name === 'en'
      );
      const pokedexText = filteredPokedexText[Math.floor(Math.random() * filteredPokedexText.length)].flavor_text;

      bot.reply(message, {
        attachments: [
          {
            fallback: `${pokemonResult.name} - ${pokedexText}`,
            color: '#36a64f',
            pretext: `Pokedex Search for "${title}" via <@${user}>`,
            title: pokemonResult.name,
            text: pokedexText,
            fields: [{
              title: 'Type',
              value: types,
              short: true,
            }, {
              title: 'Abilities',
              value: abilities,
              short: true,
            }, {
              title: 'Height',
              value: `${pokemonResult.height / 10} m`,
              short: true,
            }, {
              title: 'Weight',
              value: `${pokemonResult.weight / 10} kg`,
              short: true,
            }],
            image_url: pokemonResult.sprites.front_default,
            ts: timestamp,
          },
        ],
      });
    }).catch(() => bot.reply(message, 'There was a problem finding that pokemon'));
  });
};

export default skill;
