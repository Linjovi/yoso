# yoso
This is a node command-line tool that automatically creates files from templates
## Start
install
```
npm install -g yoso
```
Register the github user name, repos name, and branch name where your templates are stored
```
yoso config
```
Enter the user name, repos name and branch name as prompted
## Usage
### Init from template in repos
```
yoso init <tpl-name> [local-path]
```
example
```
yoso init myComponent src/views/components/helloComponent
```
The template can be a folder or a separate file.
If there is no local-path, it is inited by default in the root directory with the same file name as the template file name
### Create from template in local
```
yoso create <tpl-name> <local-path>
```
example
```
yoso create component src/views/components/helloComponent
```
