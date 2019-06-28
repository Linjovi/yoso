import { AbstractAction } from "./abstract.action";
import {configView} from "../ui/config";

export class ConfigAction extends AbstractAction {
  public async handle() {
    configView()
  }
}
