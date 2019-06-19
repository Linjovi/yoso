import { Command, CommanderStatic } from "commander";
import { AbstractCommand } from "./abstract.command";
import { NewCmd } from "./command.input";

export class InitCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command("init <tpl> <path>")
      .alias("i")
      .description("Init Files From DirTpl")
      // .option("-t, --tpl <tpl>", "choose tpl")
      .action(async (tpl: string, path: string, command: Command) => {

        let inputs: NewCmd = {path,tpl}
        await this.action.handle(inputs);
      });
  }
}
