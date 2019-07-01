import { OptionInput } from '../component/optionInput'
import * as React from 'react';
import { render } from 'ink';

export const optionView = (init:any,callback:any)=>{
    render(<OptionInput init={init} callback={callback}/>)
}