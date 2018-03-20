module.exports = exports = () => {
  let files = [];

  config._.forEach((pattern) => {
    files = files.concat(glob.sync(path.resolve(process.cwd(), pattern), {
      nocase: true,
      dot: true,
      ignore: config.ignore,
      absolute: true
    }));
  });

  if (files.length === 0) {
    leprechaun.error('YAML Lint failed.');
    leprechaun.error('No YAML files were found matching your selection.');
    process.exit(1);
  }
};
