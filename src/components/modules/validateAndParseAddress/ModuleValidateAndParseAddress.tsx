import React from 'react';
import { ParseResult } from './utils/ParseResult';
import * as appStyles from '@components/app/app.module.less';

const validAddress = 'hx0123456789012345678901234567890123456789'
const invalidAddress = 'hx01234567890'

export const ModuleValidateAndParseAddress = () => 
<div className={appStyles.module}>
  <h1><pre>validateAndParseAddress</pre></h1>
  <div>
    <p>Valid address: {validAddress}</p>
    <p>Result: <ParseResult address={validAddress}/></p>
  </div>

  <div>
    <p>Invalid address: {invalidAddress}</p>
    <p>Result: <ParseResult address={invalidAddress}/></p>
  </div>
</div>
