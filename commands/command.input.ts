export interface Input {
  name: string;
  value: boolean | string;
}

export interface NewCmd {
  path: string;
  tpl: string;
  options: { [k: string]: any };
}

export interface InitCmd {
  path?: string;
  tpl?: string;
  options: { [k: string]: any };
}
