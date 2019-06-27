import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as path from "path";
import * as inquirer from "inquirer";
import * as logSymbols from "log-symbols";
import chalk from "chalk";
import {readConfig} from "../utils/utils"

var filePath = path.dirname(__dirname); //yoso根目录

export class ConfigAction extends AbstractAction {
  public async handle() {
    var config = readConfig();
    
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "config your github user name",
          default: config.username || undefined
        },
        {
          type: "input",
          name: "repos",
          message: "config your github repos name",
          default: config.repos || undefined
        },
        {
          type: "input",
          name: "branch",
          message: "config your repos branch name",
          default: config.branch || "master"
        },{
          type: "input",
          name: "token",
          message: "config you github token (not necessary)",
          default:config.token || undefined
        }
      ])
      .then((answers: any) => {
        fs.writeFileSync(
          `${filePath}/yoso/.yosoconfig`,
          JSON.stringify(answers)
        );
        console.log(answers);
        console.log(
          logSymbols.success,
          chalk.green("config accomplish!")
        );
      });
  }
}
