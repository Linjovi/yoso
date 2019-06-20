import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { requestUrl } from "../utils/download";
import * as inquirer from "inquirer";

var filePath = path.dirname(__dirname); //tpl-stencil根目录

export class InitAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    if (fs.existsSync(inputs.path)) {
      await inquirer
        .prompt([
          {
            type: "confirm",
            name: "rewrite",
            message: `The path '${
              inputs.path
            }' is already exists, do you want to rewrite?`,
            default: false
          }
        ])
        .then((answers: any) => {
          if (answers.rewrite) {
            initTpl(inputs);
          }
        });
    } else {
      initTpl(inputs);
    }
  }
}
function initTpl(inputs: NewCmd) {
  var config = JSON.parse(
    fs.readFileSync(`${filePath}/stencil/.tplconfig`).toString()
  );
  var data = {
    username: inputs.options.username || config.username,
    repos: inputs.options.repos || config.repos,
    branch: inputs.options.branch || config.branch,
    download: inputs.tpl,
    path: inputs.path || inputs.tpl
  };
  requestUrl(data.username, data.repos, data.branch, data.download, data.path);
}
