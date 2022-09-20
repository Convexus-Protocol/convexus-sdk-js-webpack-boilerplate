import {Contract} from '@convexus/icon-toolkit';
import IConvexusFactory from '@src/artifacts/contracts/ConvexusFactory/ConvexusFactory.json';
import IConvexusPool from '@src/artifacts/contracts/ConvexusPool/ConvexusPool.json';

import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '@src/components/utils/contract/getAddressFromBookmark';

const factoryAddress = getAddressFromBookmark('Factory');

const factoryContract = new Contract(
    factoryAddress,
    IConvexusFactory,
    iconService,
    debugService,
    networkId,
);

export async function getFactoryPools() {
    const poolsSize = parseInt(await factoryContract.poolsSize());
    const indexes = [...Array(poolsSize).keys()]; // range(poolsSize)
    const poolsAddresses = await Promise.all(
        indexes.map((index) => factoryContract.pools(index)),
    );
    const poolsNames = await Promise.all(
        poolsAddresses.map((poolAddress) => {
            const poolContract = new Contract(
                poolAddress,
                IConvexusPool,
                iconService,
                debugService,
                networkId,
            );
            return poolContract.name();
        }),
    );

    return poolsAddresses.map((poolAddress, i) => {
        return {address: poolAddress, name: poolsNames[i]};
    });
}
