import * as React from "react";
import { Box, Color, Text, StdinContext, AppContext } from "ink";
import TextInput from "ink-text-input";
import { getRepoContent } from "../utils/download";

interface SearchProps {
  stdin: NodeJS.ReadStream,
  username: string,
  repo: string,
  branch: string,
  getTpl: ((value: string) => void) | undefined,
}
interface RepoItem {
  path: string,
  isSelect?: boolean
}
interface PathProps {
  stdin: NodeJS.ReadStream,
  username: string,
  repo: string,
  branch: string,
  getPath: ((value: string) => void) | undefined
}

const ARROW_UP = "\u001B[A";
const ARROW_DOWN = "\u001B[B";



export const Search = (props: SearchProps) => {
  const [value, setValue] = React.useState<string>("");
  const [lists, setList] = React.useState<RepoItem[]>([]);
  const [cursor, setCursor] = React.useState<number>(-1);
  const [allLists, setAllList] = React.useState<RepoItem[]>([]);

  const { stdin } = props;
  /**
   * Get all repo content lists
   */
  const fetchData = async ():Promise<void> => {
    const content = await getRepoContent(
      props.username,
      props.repo,
      props.branch
    );
    setAllList(content);
    setList(content);
  };
  /**
   * Set cursor and current input's tpl value
   * @param cursor 
   */
  const setCusrorAndValue = (cursor: number):void => {
    setCursor(cursor);
    setSelect(cursor);
    if (lists.length < 1) {
      return;
    }
    setValue(lists[cursor].path);
  };
  /**
   * Handle input, for judge up and down select
   * @param data 
   */
  const handleStdio = (data: NodeJS.ReadStream) => {
    const char:string = String(data);
    let nextCursor:number;
    switch (char) {
      case ARROW_UP:
        if (cursor - 1 >= 0) {
          nextCursor = cursor - 1;
        } else {
          nextCursor = 0;
        }
        setCusrorAndValue(nextCursor);
        break;
      case ARROW_DOWN:
        if (cursor + 1 >= lists.length) {
          nextCursor = lists.length - 1;
        } else {
          nextCursor = cursor + 1;
        }
        setCusrorAndValue(nextCursor);
        break;
    }
  };
  /**
   * Set Select status
   * @param curCursor
   */
  const setSelect = (curCursor: number) => {
    let nextList = lists;
    if (nextList.length == 0) {
      return;
    }
    nextList.forEach((v: RepoItem) => {
      v.isSelect = false;
    });
    nextList[curCursor].isSelect = true;
    setList(nextList);
  };
  React.useEffect((): void => {
    fetchData();
  }, []);

  React.useEffect(() => {
    stdin.on("data", handleStdio);
    return () => {
      stdin.removeListener("data", handleStdio);
    };
  });

  function onChange(value: any) {
    setValue(value);
    let nextList: RepoItem[] = [];

    allLists.forEach((item: any) => {
      item.isSelect = false;
      if (item.path.indexOf(value) !== -1) {
        nextList.push(item);
      }
    });

    const curCursor = nextList.findIndex((v: any) => {
      return v.path === value;
    });
    setCursor(curCursor);
    if (curCursor > -1) {
      nextList[curCursor].isSelect = true;
    }
    setList(nextList);
  }
  
  const Item = (props: any) => {
    if (props.isSelect) {
      return (
        <Text>
          <Color green>{props.path}</Color>
        </Text>
      );
    } else {
      return <Text>{props.path}</Text>;
    }
  };

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box marginRight={3}>
          <Text>
            Search templates on <Color cyan>Github</Color>:
          </Text>
        </Box>
        <Box>
          <TextInput
            value={value}
            onChange={onChange}
            onSubmit={props.getTpl}
          />
        </Box>
      </Box>
      <Box flexDirection="row">
        {lists.length === 0 && (
          <Text>
            <Color grey>There is no result.</Color>
          </Text>
        )}
        <Box flexDirection="column">
          {lists.map((v: RepoItem, i: number) => {
            return (
              <Box key={i} flexDirection="row">
                <Item {...v} />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};
/**
 * Path selector
 * @param props 
 */
export const Path = (props: PathProps) => {
  const [value, setValue] = React.useState("");

  const onChange = (value: string) => {
    setValue(value);
  };

  return (
    <Box>
      <Box marginRight={3}>
        <Text>
          Input your <Color cyan>Path</Color>:
        </Text>
      </Box>
      <Box>
        <TextInput value={value} onChange={onChange} onSubmit={props.getPath} />
      </Box>
    </Box>
  );
};
/**
 * Contanier component, for step by step.
 * @param props 
 */
export const SearchWithStdin = (props: any) => {
  const [finish, setFinish] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [tpl, setTpl] = React.useState("");
  let options: any = {};

  function getTpl(value: string):void {
    setStep(step + 1);
    setTpl(value);
  }

  function getPath(value: string):void {
    options.tpl = tpl;
    options.path = value;
    props.onSubmit(options);
  }

  const Panel: any = (props: any)=> {
    if (step == 1) {
      return (
        <StdinContext.Consumer>
          {({ stdin }) => <Search {...props} stdin={stdin} getTpl={getTpl} />}
        </StdinContext.Consumer>
      );
    } else if (step == 2) {
      return <Path {...props} getPath={getPath} />;
    }
  };

  return finish ? (
    <AppContext.Consumer>
      {({ exit }) => {
        setTimeout(exit);
        return <Box />;
      }}
    </AppContext.Consumer>
  ) : (
    <Panel {...props} />
  );
};
