import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { requestUrl } from "../utils/download";
import * as inquirer from "inquirer";
import {isRewrite,readConfig} from "../utils/utils";

var filePath = path.dirname(__dirname); //yoso根目录

export class InitAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    isRewrite(inputs.path,function(){initTpl(inputs)});
  }
}

function initTpl(inputs: NewCmd) {
  var config = readConfig();
  
  var data = {
    username: inputs.options.username || config.username,
    repos: inputs.options.repos || config.repos,
    branch: inputs.options.branch || config.branch,
    download: inputs.tpl,
    path: inputs.path || inputs.tpl
  };
  requestUrl(data.username, data.repos, data.branch, data.download, data.path);
}
