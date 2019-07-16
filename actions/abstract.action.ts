import { Input, NewCmd,InitCmd } from "../commands";

export abstract class AbstractAction {
  public abstract async handle(
    inputs?: NewCmd|InitCmd,
    options?: Input[]
  ): Promise<void>;
}
