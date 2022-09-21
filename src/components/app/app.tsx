import React from 'react';

import * as styles from './app.module.less';
import {ModuleValidateAndParseAddress} from '../modules/ModuleValidateAndParseAddress';
import {ModuleInstancePool} from '../modules/ModuleInstancePool';
import {ModuleListOfPools} from '../modules/ModuleListOfPools';
import {ModuleCreateAndInitializePoolIfNecessary} from '../modules/ModuleCreateAndInitializePoolIfNecessary';
import {ModuleAddLiquidity} from '../modules/ModuleAddLiquidity';
import {ModuleListOfPositions} from '../modules/ModuleListOfPositions';
import {ModuleDeletePosition} from '../modules/ModuleDeletePosition';

export const App = () => (
    <div className={styles.container}>
        <ModuleValidateAndParseAddress />
        <ModuleInstancePool />
        <ModuleListOfPools />
        <ModuleCreateAndInitializePoolIfNecessary />
        <ModuleAddLiquidity />
        <ModuleListOfPositions />
        <ModuleDeletePosition />
    </div>
);
