import {Contract} from '@convexus/icon-toolkit';
import {
    iconService,
    debugService,
    networkId,
} from '@components/utils/contract/getProviders';
import {getAddressFromBookmark} from '../getAddressFromBookmark';
import IConvexusPoolInitializer from '@src/artifacts/contracts/ConvexusPoolInitializer/ConvexusPoolInitializer.json';
import {PoolInitializer} from '@convexus/sdk';

export const poolInitializerAddress =
    getAddressFromBookmark('Pool Initializer');

PoolInitializer.setContractAddress(poolInitializerAddress);

export const poolInitializerContract = new Contract(
    poolInitializerAddress,
    IConvexusPoolInitializer,
    iconService,
    debugService,
    networkId,
);
