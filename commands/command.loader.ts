import { CommanderStatic } from 'commander';
import { NewAction,InitAction } from '../actions';
import { NewCommand } from './new.command';
import { InitCommand } from './init.command';

export class CommandLoader {
  public static load(program: CommanderStatic): void {
    new NewCommand(new NewAction()).load(program);
    new InitCommand(new InitAction()).load(program);
  }
}