import {Contract} from '@convexus/icon-toolkit';
import IConvexusFactory from '@src/artifacts/contracts/ConvexusFactory/ConvexusFactory.json';

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

export async function getPoolAddress(
    tokenA: string,
    tokenB: string,
    fee: number,
) {
    return factoryContract.getPool(tokenA, tokenB, fee);
}
