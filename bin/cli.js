#!/usr/bin/env node

"use strict";

const path = require('path');
const leprechaun = require('leprechaun');
const glob = require('glob');
const yamlLint = require('../src/yaml-lint');
const optionHelper = require('../src/option');
const poolHelper = require('../src/pool');

const options = optionHelper();
const files = poolHelper();

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

Promise.all(files.map((file) => yamlLint
  .lintFile(file, options)
  .catch((err) => {
    err.file = file;
    return err;
  })
)).then((results) => {
  const errors = results.filter((result) => result !== undefined);

  if (errors.length === 0) {
    leprechaun.success('YAML Lint successful.');
    process.exit(0);
  }

  errors.forEach((error) => {
    leprechaun.error(`YAML Lint failed for ${error.file}`);
    leprechaun.error(error.message);
  });
  process.exit(1);
});
