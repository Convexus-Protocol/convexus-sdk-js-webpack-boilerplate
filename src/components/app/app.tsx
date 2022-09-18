import React from 'react';

import * as styles from './app.module.less';
import {ModuleValidateAndParseAddress} from '../modules/ModuleValidateAndParseAddress/ModuleValidateAndParseAddress';
import {ModuleInstancePool} from '../modules/ModuleInstancePool/ModuleInstancePool';
import {ModuleListOfPools} from '../modules/ModuleListOfPools/ModuleListOfPools';
import {ModuleCreateAndInitializePoolIfNecessary} from '../modules/ModuleCreateAndInitializePoolIfNecessary/ModuleCreateAndInitializePoolIfNecessary';

export const App = () => (
    <div className={styles.container}>
        <ModuleValidateAndParseAddress />
        <ModuleInstancePool />
        <ModuleListOfPools />
        <ModuleCreateAndInitializePoolIfNecessary />
    </div>
);
