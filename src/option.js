module.exports = exports = () => {
  const path = require('path');
  const nconf = require('nconf');
  const cosmiconfig = require('cosmiconfig');
  const snakeCase = require('lodash.snakecase');
  const merge = require('lodash.merge');

  const OPTION_LIST = ['schema', 'ignore'];

  const fileOptions = cosmiconfig('yamllint', {
    rcExtensions: true,
    sync: true
  }).load();

  const envOptions = {};

  nconf.argv().env({
    match: /^yamllint/i
  }).file({
    file: path.resolve(process.cwd(), '.yaml-lint.json')
  });

  OPTION_LIST.forEach((key) => {
    const env = snakeCase(key);
    envOptions[key] =
      nconf.get(key) ||
      nconf.get(`yamllint_${env.toLowerCase()}`) ||
      nconf.get(`YAMLLINT_${env.toUpperCase()}`);
  });

  console.log(fileOptions, envOptions);
  console.log(nconf.get('_'));

  return merge({}, fileOptions ? fileOptions.config : {}, envOptions);
};
