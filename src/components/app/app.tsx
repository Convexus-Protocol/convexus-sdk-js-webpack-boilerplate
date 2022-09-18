import React from 'react';

import * as styles from './app.module.less';
import { ModuleValidateAndParseAddress } from '../modules/validateAndParseAddress/ModuleValidateAndParseAddress';
import { ModuleInstancePool } from '../modules/instancePool/ModuleInstancePool';
import { ModuleListOfPools } from '../modules/listOfPools/ModuleListOfPools';
import { ModuleCreateAndInitializePoolIfNecessary } from '../modules/createAndInitializePoolIfNecessary/ModuleCreateAndInitializePoolIfNecessary';

export const App = () => 
  <div className={styles.container}>
    <ModuleValidateAndParseAddress/>
    <ModuleInstancePool/>
    <ModuleListOfPools/>
    <ModuleCreateAndInitializePoolIfNecessary/>
  </div>
