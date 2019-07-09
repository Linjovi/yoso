import * as React from "react";
import { getRepoContent } from '../utils/download';
import { async } from "q";

interface SearchAction {
  type: string;
  text: string;
}
interface SearchItem {
  name: string;
}

const searchReducer = (searchList: SearchItem[], actions: SearchAction):any => {
  const { type, text } = actions;
  switch (type) {
    case "search":
      return searchList.filter(item => item.name === text);
  }
};

const SearchContext = React.createContext(null);

export const useSearch = () => {
  const contextValue = React.useContext(SearchContext);
  return contextValue;
};

export const SearchProvider = (props:any) => {
  const { children } = props;
  const [contextValue,dispatch] = React.useReducer(searchReducer,[]);
  const [searchList] = contextValue;


  const content = getRepoContent('brizer','yoso-tpls','master')

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
