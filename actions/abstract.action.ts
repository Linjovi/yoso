import { Input, NewCmd } from "../commands";

export abstract class AbstractAction {
  public abstract async handle(
    inputs?: NewCmd,
    options?: Input[]
  ): Promise<void>;
}
