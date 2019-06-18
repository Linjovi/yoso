import { Command, CommanderStatic } from "commander";
import { AbstractCommand } from "./abstract.command";
import { NewCmd } from "./command.input";

export class NewCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command("new <tpl> <path>")
      .alias("n")
      .description("Generate Nest application")
      // .option("-t, --tpl <tpl>", "choose tpl")
      .action(async (tpl: string, path: string, command: Command) => {

        let inputs: NewCmd = {path,tpl}
        await this.action.handle(inputs);
      });
  }
}
