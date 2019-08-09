export interface yosoConfig {
  github?:GithubInfo;
  gitlab?:GitlabInfo;
  repoSource:number;//0 for github, 1 for gitlab
}

export interface GithubInfo{
  username: string;
  repo: string;
  branch: string;
  token?: string;
}

export interface GitlabInfo{
  address:string;
  repo:string;
  branch:string;
  token:string;
}

export interface KV {
  key: string;
  value: any;
}

export interface Options {
  [k: string]: any;
}

export interface GitInfo {
  name: string;
  email: string;
}
