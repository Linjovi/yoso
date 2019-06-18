#!/usr/bin/env node

// import * as program from "commander";

// program
//   .version("0.0.4")
//   .command("new")
//   .option("-t, --tpl <tpl>", "choose tpl")
//   .option("-n, --name <name>", "set name")
//   .option("-b, --bbq-sauce", "Add bbq sauce")
//   .option(
//     "-c, --cheese [type]",
//     "Add the specified type of cheese [marble]",
//     "marble"
//   )
//   .action(function(cmd) {
//   });
// program.parse(process.argv);

import * as commander from 'commander';
import { CommanderStatic } from 'commander';
import { CommandLoader } from '../commands';

const bootstrap = () => {
  const program: CommanderStatic = commander;
  program.version(require('../package.json').version);
  CommandLoader.load(program);
  commander.parse(process.argv);

  if (!program.args.length) {
  	program.outputHelp();
  }
};

bootstrap();