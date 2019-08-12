import chalk from "chalk";
import ora from "ora";
import * as ProgressBar from "progress";
import * as logSymbols from "log-symbols";
import * as path from "path";

import Request from "./request";
import { generateFileFromTpl, rename, mkdirsSync } from "./utils";
let spinner: any = null; // loading animate
let bar: any = null; // loading bar

interface FileInfo {
  fromPath: string;
  toPath: string;
}
export const getRepoId = async (address: string, repoName: string) => {
  const url = `https://${address}/api/v4/projects`;
  const res = await Request({
    url,
    method: "get"
  });
  let repoList = JSON.parse(res.data);
  let repo = repoList.find((item: any) => {
    return item.name === repoName;
  });
  if (repo) {
    return repo.id;
  } else {
    console.log(chalk.red(`repo ${repoName} not found!`));
    return null;
  }
};

export const getRoot = async (address: string, repo: string) => {
  try {
    const url = `https://${address}/api/v4/projects/${repo}/repository/tree`;
    const res = await Request({
      url,
      method: "get"
    });
    return res.data;
  } catch (err) {
    // console.log(err)
  }
};

export const getTree = async (address: string, repo: string, path: string) => {
  try {
    const url = `https://${address}/api/v4/projects/${repo}/repository/tree?recursive=1&path=${path}&per_page=10000`;
    const res = await Request({
      url,
      method: "get"
    });
    return res.data;
  } catch (err) {
    spinner.stop();
  }
};

const downloadFiles = async (
  address: string,
  repo: string,
  branch: String,
  list: FileInfo[],
  options: any
) => {
  await Promise.all(
    list.map(async element => {
      const url = `https://${address}/api/v4/projects/${repo}/repository/files/${element.fromPath.replace(
        /\//g,
        "%2F"
      )}/?ref=${branch}`;
      // console.log(url);
      const res = await Request({
        url,
        method: "get"
      });

      var b = Buffer.from(res.data.content, "base64");
      var s = b.toString();
      const exportUrl = rename(element.fromPath, element.toPath);
      const dir = path.dirname(exportUrl);
      mkdirsSync(dir);
      generateFileFromTpl(s, options, exportUrl);

      bar.tick();
      if (bar.complete) {
        console.log(logSymbols.success, chalk.green("all files download!"));
      }
    })
  );
  spinner.stop();
};

export const downloadTpl = async (
  address: string,
  repo: string,
  branch: string,
  download: string,
  path: string,
  options: any
) => {
  spinner = ora("download start!").start();
  spinner.color = "yellow";
  spinner.text = "loading...";

  try {
    const tplTree = await getTree(address, repo, download);
    let downloadList = tplTree.filter((item: any) => {
      return item.type === "blob";
    });
    // console.log(tplTree,downloadList)
    if (downloadList.length === 0) {
      //单个文件
      const list = [{ fromPath: download, toPath: path }];
      bar = new ProgressBar(":bar :current/:total", {
        total: list.length
      });
      downloadFiles(address, repo, branch, list, options);
    } else {
      downloadList.forEach((item: any) => {
        item.fromPath = item.path;
        item.toPath = path;
      });
      bar = new ProgressBar(":bar :current/:total", {
        total: downloadList.length
      });
      downloadFiles(address, repo, branch, downloadList, options);
    }
  } catch (err) {
    spinner.stop();
  }
};

// downloadTpl("g.hz.netease.com", "35614", "master", "README.md", "demo");
// downloadFiles("g.hz.netease.com", "35614", "master", [
//   { fromPath: "vue.config.js", toPath: "" }
// ]);
