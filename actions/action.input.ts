export interface yosoConfig {
  username: string;
  repo: string;
  branch: string;
  token?: string;
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
