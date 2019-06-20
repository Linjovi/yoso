import { mkdirsSync } from "./utils";
import * as fs from "fs";
import * as path from "path";
import * as ProgressBar from "progress";
import * as logSymbols from "log-symbols";
import * as request from "request";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";
const exportBaseUrl = path.join(process.cwd(), "");
let spinner: any = null; // loading animate
let bar: any = null; // loading bar

/**
 * @desc request api get file tree
 * @param {String} username
 * @param {String} repos
 * @param {String} branch
 * @param {String} download
 */
export function requestUrl(
  username: string,
  repos: string,
  branch: string,
  download: string,
  filePath: string
) {
  // request start
  spinner = ora("download start!").start();
  spinner.color = "yellow";
  spinner.text = "loading...";
  const url = `https://api.github.com/repos/${username}/${repos}/git/trees/${branch}?recursive=1`;
  axios
    .get(url)
    .then((res: any) => {
      const data = res.data;
      const trees = data.tree;
      handleTree(username, repos, branch, trees, download, filePath);
    })
    .catch((e: any) => {
      console.log(e);
      spinner.stop();
      console.log(chalk.red(`network is error!`));
    });
}

/**
 * parse response fliter
 * @param {String} username
 * @param {String} repos
 * @param {String} branch
 * @param {String} tree
 * @param {String} download
 */
function handleTree(
  username: string,
  repos: string,
  branch: string,
  tree: [any],
  download: string,
  filePath: string
) {
  let filterList = tree.filter(item => {
    return item.type === "blob";
  });
  if (download !== "") {
    filterList = filterList.filter(item => {
      // create reg
      const downRepl = download.replace(/\//g, "\\/").replace(/\./g, "\\.");
      const reg = new RegExp(`^${downRepl}`);
      return reg.test(item.path);
    });
  }
  // request list is ready
  spinner.stop();
  bar = new ProgressBar(":bar :current/:total", {
    total: filterList.length
  });

  filterList.map(item => {
    downloadFile(username, repos, branch, item.path, filePath);
  });
}

/**
 * @param {String} username
 * @param {String} repos
 * @param {String} branch
 * @param {String} url
 */
function downloadFile(
  username: string,
  repos: string,
  branch: string,
  url: string,
  filePath: string
) {
  // download file
  const exportUrl = path.join(exportBaseUrl, filePath, path.basename(url));
  const dir = path.dirname(exportUrl);
  // mkdir
  mkdirsSync(dir);
  request(
    `https://github.com/${username}/${repos}/raw/${branch}/${url}`,
    (err: any, res: any, body: any) => {
      if (err) {
        console.log(logSymbols.error, chalk.red(`${url} is error`));
        return;
      }
      bar.tick();
      if (bar.complete) {
        console.log(
          logSymbols.success,
          chalk.green(`${repos} all files download!`)
        );
      }
    }
  ).pipe(fs.createWriteStream(exportUrl));
}
