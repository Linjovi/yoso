# tpl-stencil
This is a node command-line tool that automatically creates files from templates
## First use
Register the github user name, repos name, and branch name where your templates are stored
```tpl config```
Enter the user name, repos name and branch name as prompted
## Init from template in repos
```tpl init <tpl-name> [local-path]```
example
```tpl init myComponent src/views/components/helloComponent```
If there is no local-anme, it is inited by default in the root directory with the same file name as the template file name
## Create from template in local
```tpl create <tplrc-name> <local-path>```
example
```tpl create component src/views/components/helloComponent```
