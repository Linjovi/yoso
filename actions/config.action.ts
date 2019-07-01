import { AbstractAction } from "./abstract.action";
import { configView } from "../ui/config";
import { config } from "rxjs";
import * as fs from "fs";
import * as path from "path";

const filePath = path.dirname(__dirname); //yoso根目录

export class ConfigAction extends AbstractAction {
  public async handle() {
    configView();
  }
}
