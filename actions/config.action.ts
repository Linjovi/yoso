import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as path from "path";
import * as inquirer from "inquirer";
import * as logSymbols from "log-symbols";
import chalk from "chalk";

var filePath = path.dirname(__dirname); //tpl-stencil根目录

export class ConfigAction extends AbstractAction {
  public async handle() {
    var config = JSON.parse(
      fs.readFileSync(`${filePath}/stencil/.tplconfig`).toString()
    );
    inquirer
      .prompt([
        {
          type: "input",
          name: "username",
          message: "config your github user name",
          default: config.username || null
        },
        {
          type: "input",
          name: "repos",
          message: "config your github repos name",
          default: config.repos || null
        },
        {
          type: "input",
          name: "branch",
          message: "config your repos branch name",
          default: config.branch || null
        },{
          type: "input",
          name: "token",
          message: "config you github token (not necessary)",
          default:config.token || null
        }
      ])
      .then((answers: any) => {
        fs.writeFileSync(
          `${filePath}/stencil/.tplconfig`,
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
