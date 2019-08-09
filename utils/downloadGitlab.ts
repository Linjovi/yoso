import chalk from "chalk"

import Request from "./request";
import { generateFileFromTpl } from "./utils"
const token = ""
const address = ""
interface FileInfo {
    fromPath: string
    toPath: string
}
export const getRepoId = async (repoName: string) => {
    const url = `https://${address}/api/v3/projects?private_token=${token}`
    const res = await Request({
        url,
        method: "get"
    })
    let repoList = JSON.parse(res.data);
    let repo = repoList.find((item: any) => {
        return item.name === repoName
    })
    if (repo) {
        return repo.id
    } else {
        console.log(
            chalk.red(`repo ${repoName} not found!`)
        );
        return null
    }
}
export const getRoot = async () => {

    const url = `https://${address}/api/v3/projects/35614/repository/tree?private_token=${token}`
    const res = await Request({
        url,
        method: "get"
    })
    return res.data
}

export const getTree = async (path: string) => {
    const url = `https://${address}/api/v3/projects/35614/repository/tree?private_token=${token}&recursive=1&path=${path}`
    const res = await Request({
        url,
        method: "get"
    })
    return res.data
}

const downloadFiles = async (list: FileInfo[]) => {
    await Promise.all(
        list.map(async element => {
            const url = `https://${address}/api/v3/projects/35614/repository/files?private_token=${token}&file_path=${element.fromPath}&ref=master`
            const res = await Request({
                url,
                method: "get"
            })
            var b = new Buffer(res.data.content, 'base64')
            var s = b.toString();
            generateFileFromTpl(s, {}, element.toPath);
        }))
}

// download([{ fromPath: "src/store/modules/project.ts", toPath: "demo.ts" }])
