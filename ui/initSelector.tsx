import * as React from "react";
import { Box, render } from "ink";
import { Search, SearchWithStdin } from "../component/Search";

export const initSelector = (props: any) => {

  render(
    <SearchWithStdin {...props}/>
  );
};
