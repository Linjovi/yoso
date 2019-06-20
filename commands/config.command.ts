import { CommanderStatic } from "commander";
import { AbstractCommand } from "./abstract.command";

export class ConfigCommand extends AbstractCommand {
  public load(program: CommanderStatic) {
    program.command("config").action(async () => {
      await this.action.handle();
    });
  }
}
