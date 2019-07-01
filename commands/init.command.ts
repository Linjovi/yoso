import { Command, CommanderStatic } from "commander";
import { AbstractCommand } from "./abstract.command";
import { NewCmd } from "./command.input";

export class InitCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command("init <tpl> [path]")
      .alias("i")
      .description("Init Files From Git, example: tpl init demo src")
      .option("-b, --branch <branch>", "choose branch")
      .option("-u, --username <username>", "choose username")
      .option("-r, --repos <repos>", "choose repos")
      .option("-o, --others","add other options")
      .action(async (tpl: string, path: string, command: Command) => {
        let {branch,username,repos} = command;
        let options = {branch,username,repos,others:!!command.others}
        let inputs: NewCmd = { path, tpl, options: options };
        await this.action.handle(inputs);
      });
  }
}
