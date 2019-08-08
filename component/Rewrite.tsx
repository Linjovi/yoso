import * as React from "react";
import { Box, Text, AppContext } from "ink";
import TextInput from "ink-text-input";

export function Rewrite(props: any) {
  const [isRewrite, setIsRewrite] = React.useState("");
  const [finish, setFinish] = React.useState(false);
  const handleSubmit = () => {
    if (isRewrite) {
      //有输入
      if (
        isRewrite.toLowerCase() === "yes" ||
        isRewrite.toLowerCase() === "y"
      ) {
        setIsRewrite("yes");
      } else if (
        isRewrite.toLowerCase() === "no" ||
        isRewrite.toLowerCase() === "n"
      ) {
        setIsRewrite("no");
      } else {
        setIsRewrite("");
        return;
      }
    } else {
      //没输入
      setIsRewrite("no");
    }
    setFinish(true);
  };
  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        if(isRewrite === "yes"){
          props.callback();
        }
        return <Box />;
      }}
    </AppContext.Consumer>
  ) : (
    <Box>
      <Text bold>
        The path '{props.path}' is already exists, do you want to rewrite?(y/N)
      </Text>
      <TextInput
        value={isRewrite}
        onChange={setIsRewrite}
        onSubmit={handleSubmit}
      />
    </Box>
  );
}
