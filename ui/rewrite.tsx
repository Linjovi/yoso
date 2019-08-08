import { Rewrite } from '../component/Rewrite'
import * as React from 'react';
import { render } from 'ink';

export const rewriteView = (path:string,callback:any)=>{
    render(<Rewrite path={path} callback={callback}/>)
}