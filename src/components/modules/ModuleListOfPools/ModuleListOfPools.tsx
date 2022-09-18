import React, {useState} from 'react';

import {Contract} from '@convexus/icon-toolkit';
import IConvexusFactory from '@src/artifacts/contracts/ConvexusFactory/ConvexusFactory.json';
import * as appStyles from '@components/app/app.module.less';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/getProviders';

const factoryAddress = 'cx923993ec24429b97a1eb39af7745fb31121b1905';
const factoryContract = new Contract(
    factoryAddress,
    IConvexusFactory,
    iconService,
    debugService,
    networkId,
);

const getFactoryInfo = async (factoryContract: Contract) => {
    const poolsSize = parseInt(await factoryContract.poolsSize());
    const indexes = [...Array(poolsSize).keys()]; // range(poolsSize)
    return Promise.all(indexes.map((index) => factoryContract.pools(index)));
};

export const ModuleListOfPools = () => {
    const [poolsState, setPoolsState] = useState<string[]>([]);

    getFactoryInfo(factoryContract).then((pools) => {
        setPoolsState(pools);
    });

    return (
        <div className={appStyles.module} id="ModuleListOfPools">
            <h1>
                <pre>List of active pools</pre>
            </h1>
            <p>Number of pools: {poolsState.length}</p>
            <p>Pools addresses:</p>
            {poolsState.map((poolAddress, i) => (
                <p key={i}>
                    -{' '}
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
