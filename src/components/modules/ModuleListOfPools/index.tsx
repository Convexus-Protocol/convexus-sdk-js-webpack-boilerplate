import React, {useEffect, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getFactoryPools} from './getFactoryPools';

export const ModuleListOfPools = () => {
    const [poolsState, setPoolsState] = useState<any>();

    useEffect(() => {
        getFactoryPools().then((pools) => setPoolsState(pools));
    }, []);

    return (
        <div className={appStyles.module} id="ModuleListOfPools">
            <ModuleHeader
                text={'List of active pools'}
                name={'ModuleListOfPools'}
            />

            <p>Number of pools: {poolsState?.length}</p>
            {poolsState &&
                poolsState.map((poolState: any, i: number) => (
                    <p key={i}>
                        <a
                            href={
                                'https://tracker.berlin.icon.community/contract/' +
                                poolState.address
                            }
                        >
                            {poolState.address}
                        </a>
                        {poolState.name}
                    </p>
                ))}
        </div>
    );
};
