import { NewCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as path from "path";
import { requestUrl } from "../utils/download";
import { isRewrite, formatDate } from "../utils/utils";
import { getGitInfo, readConfig } from "../utils/info";
import { optionView } from "../ui/optionInput";
import { initSelector } from "../ui/initSelector";

interface initData {
  username: string,
  repo: string,
  branch: string,
  download: string,
  path: string
}

interface initUIValue {
  /**
   * Selected template name
   */
  tpl: string,
  /**
   * The value of path option
   */
  path: string
}

var filePath = path.dirname(__dirname); //yoso根目录

export class InitAction extends AbstractAction {
  public async handle(inputs: NewCmd) {
    isRewrite(inputs.path, function () {
      initTpl(inputs);
    });
  }

}
/**
 * Show init GUI
 * @param data 
 */
function showInitUI(data: initData) {
  initSelector({
    ...data, onSubmit: (value: initUIValue) => {
      data.download = value.tpl;
      data.path = value.path || value.tpl;

      var name = path.basename(data.path);
      const gitInfo = getGitInfo();

      var options: { [k: string]: any } = { name, date: formatDate(new Date()) };

      if (gitInfo.name) {
        options.author = gitInfo.name;
      }
      if (gitInfo.email) {
        options.email = gitInfo.email;
      }

      optionView(options, (list: any) => {
        list.forEach((element: any) => {
          options[element.key] = element.value;
        });
        console.log(options);
        requestUrl(data.username, data.repo, data.branch, data.download, data.path, options);
      });
      return;
    }
  })
}


function initTpl(inputs: NewCmd) {
  var config = readConfig();

  var data = {
    username: inputs.options.username || config.username,
    repo: inputs.options.repo || config.repo,
    branch: inputs.options.branch || config.branch || "master",
    download: inputs.tpl,
    path: inputs.path || inputs.tpl
  };
  //if use init directly
  if (!data.path) {
    showInitUI(data)
    return
  }
  var name = path.basename(data.path);
  const gitInfo = getGitInfo();

  var options: { [k: string]: any } = { name, date: formatDate(new Date()) };

  if (gitInfo.name) {
    options.author = gitInfo.name;
  }
  if (gitInfo.email) {
    options.email = gitInfo.email;
  }

  if (inputs.options.others) {
    optionView(options, (list: any) => {
      list.forEach((element: any) => {
        options[element.key] = element.value;
      });
      console.log(options);
      requestUrl(data.username, data.repo, data.branch, data.download, data.path, options);
    });
    return;
  }

  requestUrl(data.username, data.repo, data.branch, data.download, data.path, options);
}
