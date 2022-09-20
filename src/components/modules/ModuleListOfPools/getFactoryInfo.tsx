import {Contract} from '@convexus/icon-toolkit';
import IConvexusFactory from '@src/artifacts/contracts/ConvexusFactory/ConvexusFactory.json';

import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';

export async function getFactoryInfo() {
    const factoryAddress = 'cx923993ec24429b97a1eb39af7745fb31121b1905';
    const factoryContract = new Contract(
        factoryAddress,
        IConvexusFactory,
        iconService,
        debugService,
        networkId,
    );

    const poolsSize = parseInt(await factoryContract.poolsSize());
    const indexes = [...Array(poolsSize).keys()]; // range(poolsSize)
    return Promise.all(indexes.map((index) => factoryContract.pools(index)));
}
