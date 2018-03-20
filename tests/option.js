const tap = require("tap");
const optionHelper = require("../src/option");

tap.equal(typeof optionHelper, "function");

tap.test("No option", (childTest) => {
  const options = optionHelper();

  tap.equal(typeof options, "object");
  tap.equal(options.schema, undefined);
  tap.equal(options.ignore, undefined);

  childTest.end();
});

tap.test("Env option", (childTest) => {
  process.env.YAMLLINT_IGNORE = 'ignorepath';
  const options = optionHelper();
  delete process.env.YAMLLINT_IGNORE;

  tap.equal(options.schema, undefined);
  tap.equal(options.ignore, 'ignorepath');

  childTest.end();
});

tap.test("Argv option", (childTest) => {
  process.argv.push('--schema', 'someschema');
  const options = optionHelper();
  process.argv.pop();
  process.argv.pop();

  tap.equal(options.ignore, undefined);
  tap.equal(options.schema, 'someschema');

  childTest.end();
});

tap.test("Option priority", (childTest) => {
  process.env.YAMLLINT_IGNORE = 'ignore_from_env';
  process.argv.push('--ignore', 'ignore_from_argv');
  const options = optionHelper();
  delete process.env.YAMLLINT_IGNORE;
  process.argv.pop();
  process.argv.pop();

  tap.equal(options.ignore, 'ignore_from_argv');
  tap.equal(options.schema, undefined);

  childTest.end();
});
