import * as path from "path";
const download = require("download-git-repo");
import {promisify} from 'util'

export async function downloadRepo(target: any) {
  try {
    target = target || './demo'
    const downloadP = promisify(download)
    await downloadP("Linjovi/bankendManage", target, false);
    return target;
  } catch (error) {
    throw new Error("error");
  }
}
