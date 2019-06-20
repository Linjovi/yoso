export interface Input {
  name: string;
  value: boolean | string;
}

export interface NewCmd {
  path: string;
  tpl: string;
  options: any;
}
