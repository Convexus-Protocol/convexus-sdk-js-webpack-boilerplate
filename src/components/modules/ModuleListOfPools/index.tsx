import React, {useEffect, useState} from 'react';

import * as appStyles from '@components/app/app.module.less';
import {ModuleHeader} from '@src/components/common/ModuleHeader';
import {getFactoryPools} from './getFactoryPools';

export const ModuleListOfPools = () => {
    const [poolsState, setPoolsState] = useState<any>();

    useEffect(() => {
        getFactoryPools().then((pools) => setPoolsState(pools));
    }, []);

    const copyToClipboard = async (address: string) => {
        await navigator.clipboard.writeText(address);
    };

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
                        <button
                            onClick={() => copyToClipboard(poolState.address)}
                        >
                            Copy
                        </button>{' '}
                        &nbsp;
                        <a
                            href={
                                'https://tracker.lisbon.icon.community/contract/' +
                                poolState.address
                            }
                        >
                            {poolState.address}
                        </a>
                        : {poolState.name}
                    </p>
                ))}
        </div>
    );
};
