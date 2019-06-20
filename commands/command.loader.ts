import { CommanderStatic } from "commander";
import { NewAction, InitAction, ConfigAction } from "../actions";
import { NewCommand } from "./new.command";
import { InitCommand } from "./init.command";
import { ConfigCommand } from "./config.command";

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new NewCommand(new NewAction()).load(program);
    new InitCommand(new InitAction()).load(program);
    new ConfigCommand(new ConfigAction()).load(program);
  }
}
