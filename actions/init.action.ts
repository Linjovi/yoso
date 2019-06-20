import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as fs from "fs";
import * as nunjucks from "nunjucks";
import * as path from "path";
import { requestUrl } from "../utils/download";

var filePath = path.dirname(__dirname);//tpl-stencil根目录

export class InitAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    if (fs.existsSync(inputs.path)) {
      console.log(`项目路径${inputs.path}已经存在`);
      return;
    }
    var config = JSON.parse(fs.readFileSync(`${filePath}/stencil/.tplconfig`).toString())
    var data = {
      username: inputs.options.username || config.username,
      repos: inputs.options.repos || config.repos,
      branch: inputs.options.branch || config.branch,
      download: inputs.tpl,
      path: inputs.path || inputs.tpl
    };
    requestUrl(
      data.username,
      data.repos,
      data.branch,
      data.download,
      data.path
    );
  }
}
