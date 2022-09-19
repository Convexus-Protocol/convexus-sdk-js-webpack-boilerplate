import React, {useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '../ModuleHeader';
import {getFactoryInfo} from './getFactoryInfo';

export const ModuleListOfPools = () => {
    const [poolsState, setPoolsState] = useState<string[]>([]);

    getFactoryInfo().then((pools) => {
        setPoolsState(pools);
    });

    return (
        <div className={appStyles.module} id="ModuleListOfPools">
            <ModuleHeader
                text={'List of active pools'}
                name={'ModuleListOfPools'}
            />

            <p>Number of pools: {poolsState.length}</p>
            <p>Pools addresses:</p>
            {poolsState.map((poolAddress, i) => (
                <p key={i}>
                    -
                    <a
                        href={
                            'https://tracker.berlin.icon.community/contract/' +
                            poolAddress
                        }
                    >
                        {poolAddress}
                    </a>
                </p>
            ))}
        </div>
    );
};
