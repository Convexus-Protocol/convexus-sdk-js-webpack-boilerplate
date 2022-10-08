import React from 'react';

import * as styles from './app.module.less';
import {ModuleInstancePool} from '../modules/ModuleInstancePool';
import {ModuleListOfPools} from '../modules/ModuleListOfPools';
import {ModuleCreateAndInitializePoolIfNecessary} from '../modules/ModuleCreateAndInitializePoolIfNecessary';
import {ModuleAddLiquidity} from '../modules/ModuleAddLiquidity';
import {ModuleListOfPositions} from '../modules/ModuleListOfPositions';
import {ModuleDecreaseLiquidity} from '../modules/ModuleDecreaseLiquidity';
import {ModuleIncreaseLiquidity} from '../modules/ModuleIncreaseLiquidity';
import {ModulePlotPoolLiquidity} from '../modules/ModulePlotPoolLiquidity';
import {ModuleSwap} from '../modules/ModuleSwap';
import {ModuleRouting} from '../modules/ModuleRouting';

export const App = () => (
    <div className={styles.container}>
        <ModuleListOfPools />
        <ModuleInstancePool />
        <ModuleCreateAndInitializePoolIfNecessary />
        <ModuleAddLiquidity />
        <ModuleListOfPositions />
        <ModuleDecreaseLiquidity />
        <ModuleIncreaseLiquidity />
        <ModulePlotPoolLiquidity />
        <ModuleSwap />
        <ModuleRouting />
    </div>
);
