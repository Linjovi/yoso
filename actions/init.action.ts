import { InitCmd } from "../commands";
import { AbstractAction } from "./abstract.action";
import * as path from "path";
import { requestUrl } from "../utils/download";
import { isRewrite, formatDate } from "../utils/utils";
import { getGitInfo, readConfig } from "../utils/info";
import { optionView } from "../ui/optionInput";
import { initSelector } from "../ui/initSelector";
import { KV } from "./action.input";

interface initData {
  username: string;
  repo: string;
  branch: string;
  download: string | undefined;
  path: string | undefined;
}

interface initUIValue {
  /**
   * Selected template name
   */
  tpl: string;
  /**
   * The value of path option
   */
  path: string;
}

export class InitAction extends AbstractAction {
  public async handle(inputs: InitCmd) {
    var config = readConfig();

    if (config.repoSource === 0) {//github
      let data = {
        username: inputs.options.username || config.github!.username,
        repo: inputs.options.repo || config.github!.repo,
        branch: inputs.options.branch || config.github!.branch || "master",
        download: inputs.tpl,
        path: inputs.path
      };

      //if use init directly
      if (!data.download) {
        showInitUI(data);
        return;
      }
      isRewrite(data.path, () => {
        initTpl(data, inputs.options.others);
      });
    }else if(config.repoSource === 1){
      // let data = {
      //   address: inputs.options.address || config.gitlab!.address,
      //   repo: inputs.options.repo || config.gitlab!.repo,
      //   branch: inputs.options.branch || config.gitlab!.branch || "master",
      //   download: inputs.tpl,
      //   path: inputs.path
      // }
    }
  }
}
/**
 * Show init GUI
 * @param data
 */
function showInitUI(data: initData) {
  initSelector({
    ...data,
    onSubmit: (value: initUIValue) => {
      data.download = value.tpl;
      data.path = value.path;
      initTpl(data, true);
    }
  });
}

function initTpl(data: initData, others: boolean) {
  if (!data.path && data.download) {
    data.path = path.basename(data.download).split(".")[0];
  }
  var name = path.basename((data.path as string));
  const gitInfo = getGitInfo();

  var options: { [k: string]: any } = { name, date: formatDate(new Date()) };

  if (gitInfo.name) {
    options.author = gitInfo.name;
  }
  if (gitInfo.email) {
    options.email = gitInfo.email;
  }

  if (others) {
    optionView(options, (list: KV[]) => {
      list.forEach((element: KV) => {
        options[element.key] = element.value;
      });
      console.log(options);
      requestUrl(
        data.username,
        data.repo,
        data.branch,
        (data.download as string),
        (data.path as string),
        options
      );
    });
    return;
  }

  requestUrl(
    data.username,
    data.repo,
    data.branch,
    (data.download as string),
    (data.path as string),
    options
  );
}
