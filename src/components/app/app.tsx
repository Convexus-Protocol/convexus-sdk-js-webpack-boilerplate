import React from 'react';

import * as styles from './app.module.less';
import {ModuleValidateAndParseAddress} from '../modules/ModuleValidateAndParseAddress';
import {ModuleInstancePool} from '../modules/ModuleInstancePool';
import {ModuleListOfPools} from '../modules/ModuleListOfPools';
import {ModuleCreateAndInitializePoolIfNecessary} from '../modules/ModuleCreateAndInitializePoolIfNecessary';

export const App = () => (
    <div className={styles.container}>
        <ModuleValidateAndParseAddress />
        <ModuleInstancePool />
        <ModuleListOfPools />
        <ModuleCreateAndInitializePoolIfNecessary />
    </div>
);
