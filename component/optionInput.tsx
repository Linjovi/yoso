import * as React from "react";
import { AppContext, Box } from "ink";
import TextInput from "ink-text-input";
import Table from "ink-table";
import { callbackify } from "util";

export const OptionInput = (props: any) => {
  const [value, setValue] = React.useState("");
  const options = props.init;
  var tmpList = [];
  for (let key in options) {
    tmpList.push({ key: key, value: options[key] });
  }
  const [list, setList] = React.useState(tmpList);
  const [finish, setFinish] = React.useState(false);
  const handleSubmit = () => {
    let str = value.replace(/^\s+|\s+$/g, "");
    str = str.replace(/\s+/g, " ");

    switch (str.split(" ").length) {
      case 1: //exit
        setFinish(true);
        props.callback(list);
        break;
      case 2:
        const key = str.split(" ")[0];
        const value = str.split(" ")[1];
        const index = list.findIndex(item => {
          return item.key === key;
        });
        if (index >= 0) {
          list.splice(index, 1, { key, value })
          setList(list);
        } else {
          setList(list.concat({ key, value }));
        }

        setValue("");
        break;
      default:
      // setValue(str);
      // setFinish(true);
    }
  };

  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        return (
          <Box>
            {/* <Table data={list} /> */}
            {finish}
          </Box>
        );
      }}
    </AppContext.Consumer>
  ) : (
    <Box flexDirection="column">
      <Table data={list} />
      <Box>
        <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} />
      </Box>
    </Box>
  );
};
