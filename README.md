# YOSO[![npm](https://img.shields.io/npm/v/yoso.svg?maxAge=2592000)](https://www.npmjs.com/package/yoso)
[中文文档](./readme_zh.md)

This is a command line tool that automatically generates files from custom templates. You only need to set it once before you can reuse it.

## Install

```bash
$ npm install -g yoso
```

## Usage

#### First use

Write your own template file before using it for the first time. Here is the template engine used is nunjucks, related syntax reference [nunjucks official website](https://nunjucks.bootcss.com/).You can put multiple template files in a folder with a certain file structure, or you can put a single file. Use the suffix you want for the template file.
For Example
```
component
├── component.html
├── component.js
├── component.scss
└── ui.js
vue-ts.vue
vuex.ts
```

To load template files from the github repository, you need to set up the github repository information first. Includes username, repository name, branch name (default master), token (not required, but github limits requests to 60 requests per hour for unauthenticated requests).
```bash
$ yoso config
```

#### Generate files

1. Load the template locally
```bash
$ yoso new [options] <tpl> <path>
```
For example
```bash
$ yoso new vuex src/store/demo 
```

2. Load the template from the github repository
```bash
$ yoso init [options] <tpl> [path]
```
For example
```bash
$ yoso init vuex src/store/demo
```

You can use the command line option ```-o``` or ```--others``` to add custom fields, and inserted into the corresponding position in the template. The default fields include:
```
{
  name,//From the input path
  author,//From the git config
  email,//From the git config
}
```
You can override the default field with a custom field of the same name.
