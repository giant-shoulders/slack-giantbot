import * as skills from '../skills';

export default (controller, giantbot) => {
  Object.keys(skills).forEach(key => skills[key]({ controller, giantbot }));
};
