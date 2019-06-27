import { Command, CommanderStatic } from "commander";
import { AbstractCommand } from "./abstract.command";
import { NewCmd } from "./command.input";

export class NewCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program
      .command("new <tpl> <path>")
      .alias("n")
      .description(
        "Generate File From tplrc, example: tpl new vue src/views/demo"
      )
      .option("-o, --others", "add other options")
      .action(async (tpl: string, path: string, command: Command) => {
        let others = !!command.others
        let inputs: NewCmd = { path, tpl, options: {others} };
        await this.action.handle(inputs);
      });
  }
}
